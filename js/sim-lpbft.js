const LPBFTSimulator = {
    generateConsensusId: function() {
        return 'consensus-' + Math.random().toString(36).substr(2, 9);
    },

    createNodes: function(n, faulty) {
        const nodes = [];
        const faultyIndices = new Set();
        
        while (faultyIndices.size < faulty) {
            const idx = Math.floor(Math.random() * (n - 1)) + 1; // 리더(0)는 제외
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
        return nodes;
    },

    simulateVote: function(node) {
        if (node.isFaulty) {
            // 장애 노드는 랜덤하게 투표하거나 안함
            const r = Math.random();
            if (r < 0.3) return null; // 무응답
            if (r < 0.6) return 'REJECT';
            return 'APPROVE';
        }
        // 정상 노드는 대부분 APPROVE
        return Math.random() < 0.95 ? 'APPROVE' : 'REJECT';
    },

    checkConsensus: function(nodes, required) {
        const approves = nodes.filter(n => n.vote === 'APPROVE').length;
        const rejects = nodes.filter(n => n.vote === 'REJECT').length;
        return {
            approves,
            rejects,
            reached: approves >= required,
            required
        };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const nodesViz = document.getElementById('nodesViz');

    let nodes = [];

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function resetUI() {
        document.querySelectorAll('.phase').forEach(p => p.className = 'phase');
        document.getElementById('approveCount').textContent = '0';
        document.getElementById('rejectCount').textContent = '0';
        document.getElementById('consensusResult').className = 'consensus-result';
        document.getElementById('resultIcon').textContent = '⏳';
        document.getElementById('resultText').textContent = '합의 대기 중';
        document.getElementById('resultDetail').textContent = '';
    }

    function renderNodes() {
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
                <span class="node-status">${node.isLeader ? 'Leader' : node.isFaulty ? 'Faulty' : 'Ready'}</span>
            `;
            nodesViz.appendChild(div);
        });
    }

    function updateNodeUI(nodeId, status, vote) {
        const el = document.getElementById('node-' + nodeId);
        if (!el) return;
        
        el.classList.remove('voting', 'approve', 'reject');
        if (status === 'voting') {
            el.classList.add('voting');
            el.querySelector('.node-status').textContent = 'Voting...';
        } else if (vote === 'APPROVE') {
            el.classList.add('approve');
            el.querySelector('.node-status').textContent = 'APPROVE ✓';
        } else if (vote === 'REJECT') {
            el.classList.add('reject');
            el.querySelector('.node-status').textContent = 'REJECT ✗';
        } else {
            el.querySelector('.node-status').textContent = 'No Response';
        }
    }

    function setPhase(phaseNum) {
        document.querySelectorAll('.phase').forEach((p, i) => {
            if (i + 1 < phaseNum) p.classList.add('done');
            else if (i + 1 === phaseNum) p.classList.add('active');
            else p.classList.remove('active', 'done');
        });
    }

    async function runSimulation() {
        resetUI();
        runBtn.disabled = true;
        runBtn.textContent = '합의 진행 중...';
        runBtn.classList.add('running');

        const n = parseInt(document.getElementById('nodeCount').value);
        const faulty = parseInt(document.getElementById('faultyCount').value);
        const trigger = document.getElementById('triggerReason').value;
        const f = Math.floor((n - 1) / 3);
        const required = Math.ceil(n * 2 / 3);

        document.getElementById('requiredCount').textContent = required;

        // 노드 생성
        nodes = LPBFTSimulator.createNodes(n, Math.min(faulty, f + 1));
        renderNodes();

        const consensusId = LPBFTSimulator.generateConsensusId();
        log('=== LPBFT 합의 시작 ===');
        log('합의 ID: ' + consensusId);
        log('트리거 사유: ' + trigger);
        log('노드 수: ' + n + ', 허용 장애: ' + f + ', 필요 동의: ' + required);

        // Phase 1: PREPARE
        setPhase(1);
        log('[PREPARE] 리더 노드가 합의 요청 브로드캐스트', 'info');
        await new Promise(r => setTimeout(r, 1000));

        // Phase 2: COMMIT (투표)
        setPhase(2);
        log('[COMMIT] 각 노드 투표 수집 중...', 'info');

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            updateNodeUI(node.id, 'voting', null);
            await new Promise(r => setTimeout(r, 300));

            const vote = LPBFTSimulator.simulateVote(node);
            node.vote = vote;
            node.status = 'voted';
            
            updateNodeUI(node.id, 'voted', vote);
            
            if (vote) {
                log('  ' + node.name + ': ' + vote, vote === 'APPROVE' ? 'success' : 'error');
            } else {
                log('  ' + node.name + ': 무응답', 'warn');
            }

            // 투표 현황 업데이트
            const current = LPBFTSimulator.checkConsensus(nodes, required);
            document.getElementById('approveCount').textContent = current.approves;
            document.getElementById('rejectCount').textContent = current.rejects;
        }

        await new Promise(r => setTimeout(r, 500));

        // Phase 3: REPLY
        setPhase(3);
        const result = LPBFTSimulator.checkConsensus(nodes, required);
        log('[REPLY] 투표 집계 완료', 'info');
        log('APPROVE: ' + result.approves + ', REJECT: ' + result.rejects + ', 필요: ' + result.required);

        const consensusResult = document.getElementById('consensusResult');
        const resultIcon = document.getElementById('resultIcon');
        const resultText = document.getElementById('resultText');
        const resultDetail = document.getElementById('resultDetail');

        if (result.reached) {
            consensusResult.classList.add('success');
            resultIcon.textContent = '✅';
            resultText.textContent = '합의 도달';
            resultDetail.textContent = result.approves + '/' + n + ' 노드 동의 (필요: ' + required + ')';
            log('=== 합의 성공: 정상 데이터 채택 ===', 'success');
        } else {
            consensusResult.classList.add('fail');
            resultIcon.textContent = '❌';
            resultText.textContent = '합의 실패';
            resultDetail.textContent = result.approves + '/' + n + ' 노드 동의 (필요: ' + required + ')';
            log('=== 합의 실패: 재시도 또는 에스컬레이션 필요 ===', 'error');
        }

        runBtn.disabled = false;
        runBtn.textContent = '합의 시작';
        runBtn.classList.remove('running');
    }

    // 노드 수 변경 시 장애 노드 옵션 업데이트
    document.getElementById('nodeCount').addEventListener('change', function() {
        const n = parseInt(this.value);
        const f = Math.floor((n - 1) / 3);
        const faultySelect = document.getElementById('faultyCount');
        
        // 옵션 재생성
        faultySelect.innerHTML = '';
        for (let i = 0; i <= f + 1; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i + '개' + (i === 0 ? ' (전원 정상)' : i > f ? ' (합의 불가)' : '');
            faultySelect.appendChild(opt);
        }
    });

    runBtn.addEventListener('click', runSimulation);
});
