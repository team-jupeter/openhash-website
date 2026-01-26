/**
 * OpenHash LPBFT Consensus Simulator
 * Lightweight Practical Byzantine Fault Tolerance - API 연동 버전
 */
const LPBFTSimulator = {
    apiConnected: false,
    currentPhase: null,
    nodes: [],

    // 노드 상태 확인
    async checkNodeStatus() {
        try {
            const data = await OpenHashConfig.get(4, '/health');
            this.apiConnected = data.status === 'healthy';
            return this.apiConnected;
        } catch (e) {
            this.apiConnected = false;
            return false;
        }
    },

    // API: LPBFT 상태 조회
    async getLPBFTStatus() {
        try {
            return await OpenHashConfig.get(4, '/lpbft/status');
        } catch (e) {
            return { error: e.message };
        }
    },

    // API: LPBFT 트리거
    async triggerLPBFT(reason, data) {
        try {
            return await OpenHashConfig.post(4, '/lpbft/trigger', { reason, data });
        } catch (e) {
            return { error: e.message };
        }
    },

    generateConsensusId() {
        return 'consensus-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    createNodes(n, faulty) {
        const nodes = [];
        const faultyIndices = new Set();
        while (faultyIndices.size < faulty) {
            const idx = Math.floor(Math.random() * (n - 1)) + 1;
            faultyIndices.add(idx);
        }
        for (let i = 0; i < n; i++) {
            nodes.push({
                id: 'node_' + i,
                name: 'Node ' + i,
                isLeader: i === 0,
                isFaulty: faultyIndices.has(i),
                vote: null,
                status: 'ready'
            });
        }
        this.nodes = nodes;
        return nodes;
    },

    simulateVote(node) {
        if (node.isFaulty) {
            const r = Math.random();
            if (r < 0.3) return null;
            if (r < 0.6) return 'REJECT';
            return 'APPROVE';
        }
        return Math.random() < 0.95 ? 'APPROVE' : 'REJECT';
    },

    checkConsensus(nodes, required) {
        const approves = nodes.filter(n => n.vote === 'APPROVE').length;
        const rejects = nodes.filter(n => n.vote === 'REJECT').length;
        const noResponse = nodes.filter(n => n.vote === null).length;
        return {
            approves,
            rejects,
            noResponse,
            reached: approves >= required,
            required
        };
    },

    // BFT 공식: n = 3f + 1, 필요 합의 = 2f + 1
    calculateBFT(n) {
        const f = Math.floor((n - 1) / 3);
        const required = 2 * f + 1;
        return { n, f, required };
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const nodesViz = document.getElementById('nodesViz');
    const nodeCountInput = document.getElementById('nodeCount');
    const faultyCountInput = document.getElementById('faultyCount');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('nodeStatusText');

    let nodes = [];

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.innerHTML = '<span class="log-time">[' + new Date().toLocaleTimeString() + ']</span> ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // 초기 노드 상태 확인
    const connected = await LPBFTSimulator.checkNodeStatus();
    if (statusIcon) statusIcon.classList.add(connected ? 'online' : 'offline');
    if (statusText) statusText.textContent = connected ? 'L4 노드 연결됨' : '시뮬레이션 모드';
    log(connected ? '✅ L4 노드 연결 성공' : '⚡ 시뮬레이션 모드', connected ? 'success' : 'warning');

    function resetUI() {
        document.querySelectorAll('.phase').forEach(p => p.classList.remove('active', 'done'));
        const approveEl = document.getElementById('approveCount');
        const rejectEl = document.getElementById('rejectCount');
        if (approveEl) approveEl.textContent = '0';
        if (rejectEl) rejectEl.textContent = '0';
    }

    function renderNodes() {
        if (!nodesViz) return;
        nodesViz.innerHTML = '';
        nodes.forEach(node => {
            const div = document.createElement('div');
            div.className = 'node-item';
            div.id = 'node-' + node.id;
            if (node.isLeader) div.classList.add('leader');
            if (node.isFaulty) div.classList.add('faulty');
            div.innerHTML = `
                <span class="node-icon">${node.isLeader ? '👑' : node.isFaulty ? '⚠️' : '🖥️'}</span>
                <span class="node-name">${node.name}</span>
                <span class="node-vote">-</span>
            `;
            nodesViz.appendChild(div);
        });
    }

    function updateNodeVote(nodeId, vote) {
        const el = document.getElementById('node-' + nodeId);
        if (!el) return;
        el.classList.remove('voting', 'approve', 'reject', 'no-response');
        const voteEl = el.querySelector('.node-vote');
        
        if (vote === 'APPROVE') {
            el.classList.add('approve');
            if (voteEl) voteEl.textContent = '✓';
        } else if (vote === 'REJECT') {
            el.classList.add('reject');
            if (voteEl) voteEl.textContent = '✗';
        } else {
            el.classList.add('no-response');
            if (voteEl) voteEl.textContent = '?';
        }
    }

    function setPhase(phaseNum) {
        document.querySelectorAll('.phase').forEach((p, i) => {
            p.classList.remove('active');
            if (i < phaseNum - 1) p.classList.add('done');
        });
        const current = document.getElementById('phase' + phaseNum);
        if (current) current.classList.add('active');
    }

    function showResultModal(success, result) {
        const existingModal = document.getElementById('resultModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'resultModal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content ${success ? 'success' : 'fail'}">
                <div class="modal-header">
                    <span class="modal-icon">${success ? '✅' : '❌'}</span>
                    <h3>${success ? '합의 달성' : '합의 실패'}</h3>
                </div>
                <div class="modal-body">
                    <div class="result-stats">
                        <div class="stat"><span class="stat-label">찬성</span><span class="stat-value approve">${result.approves}</span></div>
                        <div class="stat"><span class="stat-label">반대</span><span class="stat-value reject">${result.rejects}</span></div>
                        <div class="stat"><span class="stat-label">무응답</span><span class="stat-value">${result.noResponse}</span></div>
                        <div class="stat"><span class="stat-label">필요</span><span class="stat-value">${result.required}</span></div>
                    </div>
                </div>
                <button class="modal-close" onclick="this.closest('.result-modal').remove()">확인</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    async function runSimulation() {
        runBtn.disabled = true;
        runBtn.textContent = '합의 진행 중...';
        resetUI();

        const n = parseInt(nodeCountInput?.value) || 7;
        const faulty = parseInt(faultyCountInput?.value) || 2;
        const bft = LPBFTSimulator.calculateBFT(n);
        const consensusId = LPBFTSimulator.generateConsensusId();

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🔄 LPBFT 합의 시작: ' + consensusId, 'info');
        log('노드 수: ' + n + ', 허용 장애: ' + bft.f + ', 필요 합의: ' + bft.required, 'info');

        // 노드 생성
        nodes = LPBFTSimulator.createNodes(n, faulty);
        renderNodes();
        log('📡 노드 ' + n + '개 생성 (장애 노드: ' + faulty + '개)', 'info');

        // API 연동 시도
        if (LPBFTSimulator.apiConnected) {
            log('📡 L4 노드 LPBFT 트리거...', 'info');
            const apiResult = await LPBFTSimulator.triggerLPBFT('simulation', { consensusId });
            if (!apiResult.error) {
                log('✅ API 응답: ' + (apiResult.triggered ? '트리거됨' : '대기'), 'success');
            }
        }

        // Phase 1: PREPARE
        await new Promise(r => setTimeout(r, 500));
        setPhase(1);
        log('📋 Phase 1: PREPARE - 리더가 제안 전파', 'info');

        // Phase 2: PROMISE
        await new Promise(r => setTimeout(r, 600));
        setPhase(2);
        log('🤝 Phase 2: PROMISE - 노드들 약속 응답', 'info');

        // Phase 3: ACCEPT (투표)
        await new Promise(r => setTimeout(r, 600));
        setPhase(3);
        log('🗳️ Phase 3: ACCEPT - 투표 진행 중...', 'info');

        // 각 노드 투표 시뮬레이션
        for (let i = 0; i < nodes.length; i++) {
            await new Promise(r => setTimeout(r, 150));
            const vote = LPBFTSimulator.simulateVote(nodes[i]);
            nodes[i].vote = vote;
            updateNodeVote(nodes[i].id, vote);
            
            const voteText = vote === 'APPROVE' ? '✓ 찬성' : vote === 'REJECT' ? '✗ 반대' : '? 무응답';
            log('  ' + nodes[i].name + ': ' + voteText, vote === 'APPROVE' ? 'success' : vote === 'REJECT' ? 'error' : 'warning');
        }

        // 투표 집계
        const result = LPBFTSimulator.checkConsensus(nodes, bft.required);
        const approveEl = document.getElementById('approveCount');
        const rejectEl = document.getElementById('rejectCount');
        if (approveEl) approveEl.textContent = result.approves;
        if (rejectEl) rejectEl.textContent = result.rejects;

        // Phase 4: COMMIT
        await new Promise(r => setTimeout(r, 500));
        setPhase(4);
        
        if (result.reached) {
            log('✅ Phase 4: COMMIT - 합의 달성! (' + result.approves + '/' + bft.required + ')', 'success');
        } else {
            log('❌ Phase 4: COMMIT 실패 - 합의 미달 (' + result.approves + '/' + bft.required + ')', 'error');
        }

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log(result.reached ? '🎉 합의 완료: 블록 확정' : '⚠️ 합의 실패: 재시도 필요', result.reached ? 'success' : 'error');

        // 결과 모달
        await new Promise(r => setTimeout(r, 300));
        showResultModal(result.reached, result);

        runBtn.disabled = false;
        runBtn.textContent = '합의 실행';
    }

    if (runBtn) runBtn.addEventListener('click', runSimulation);

    // BFT 계산 표시
    function updateBFTInfo() {
        const n = parseInt(nodeCountInput?.value) || 7;
        const bft = LPBFTSimulator.calculateBFT(n);
        const bftInfo = document.getElementById('bftInfo');
        if (bftInfo) {
            bftInfo.textContent = 'n=' + n + ', f=' + bft.f + ', 필요 합의=' + bft.required;
        }
    }

    if (nodeCountInput) {
        nodeCountInput.addEventListener('change', updateBFTInfo);
        updateBFTInfo();
    }
});
