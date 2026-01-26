/**
 * OpenHash Hash Chain & Merkle Tree Simulator
 * 해시 체인 + 머클 트리 시뮬레이션 - API 연동 버전
 */
const HashChainSimulator = {
    chain: [],
    merkleTransactions: [],

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const hex = Math.abs(hash).toString(16).padStart(8, '0');
        return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
    },

    calculateBlockHash(block) {
        const content = JSON.stringify({
            index: block.index,
            timestamp: block.timestamp,
            data: block.data,
            prevHash: block.prevHash,
            layerId: block.layerId
        });
        return '0x' + this.simpleHash(content).substring(0, 62);
    },

    createGenesisBlock(layerId) {
        const block = {
            index: 0,
            timestamp: new Date().toISOString(),
            data: { message: 'OpenHash Genesis Block', layerId },
            prevHash: '0x' + '0'.repeat(62),
            layerId: layerId
        };
        block.hash = this.calculateBlockHash(block);
        return block;
    },

    createBlock(data, layerId) {
        const prevBlock = this.chain[this.chain.length - 1];
        const block = {
            index: prevBlock.index + 1,
            timestamp: new Date().toISOString(),
            data: { transactions: [data], merkleRoot: this.simpleHash(data) },
            prevHash: prevBlock.hash,
            layerId: layerId
        };
        block.hash = this.calculateBlockHash(block);
        return block;
    },

    initChain(layerId) {
        this.chain = [this.createGenesisBlock(layerId)];
        return this.chain;
    },

    addBlock(data, layerId) {
        const block = this.createBlock(data, layerId);
        this.chain.push(block);
        return block;
    },

    tamperBlock(index) {
        if (index <= 0 || index >= this.chain.length) return false;
        this.chain[index].data.transactions[0] = '[TAMPERED] ' + this.chain[index].data.transactions[0];
        return true;
    },

    verifyChain() {
        const results = [];
        for (let i = 0; i < this.chain.length; i++) {
            const block = this.chain[i];
            const computedHash = this.calculateBlockHash(block);
            const hashValid = computedHash === block.hash;
            let linkValid = true;
            if (i > 0) {
                linkValid = block.prevHash === this.chain[i - 1].hash;
            }
            results.push({ index: i, hashValid, linkValid, valid: hashValid && linkValid });
        }
        return results;
    },

    // ========== Merkle Tree ==========
    buildMerkleTree(transactions) {
        if (transactions.length === 0) return { root: null, levels: [] };
        
        // 리프 노드 생성
        let currentLevel = transactions.map((tx, idx) => ({
            hash: this.simpleHash(tx),
            data: tx,
            index: idx,
            isLeaf: true
        }));
        
        // 홀수 개면 마지막 복제
        if (currentLevel.length % 2 !== 0) {
            currentLevel.push({ ...currentLevel[currentLevel.length - 1], isDuplicate: true });
        }
        
        const levels = [currentLevel];
        
        // 루트까지 상향식 구축
        while (currentLevel.length > 1) {
            const nextLevel = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = currentLevel[i + 1] || left;
                const combinedHash = this.simpleHash(left.hash + right.hash);
                nextLevel.push({
                    hash: combinedHash,
                    left: left,
                    right: right,
                    isLeaf: false
                });
            }
            levels.push(nextLevel);
            currentLevel = nextLevel;
        }
        
        return {
            root: currentLevel[0]?.hash || null,
            levels: levels
        };
    },

    addMerkleTransaction(tx) {
        this.merkleTransactions.push(tx);
        return this.buildMerkleTree(this.merkleTransactions);
    },

    clearMerkleTransactions() {
        this.merkleTransactions = [];
    },

    // Backend API
    async getChainAPI(layer = 1) {
        try {
            return await OpenHashConfig.get(layer, '/chain');
        } catch (e) {
            return { error: e.message };
        }
    },

    async verifyChainAPI(layer = 1) {
        try {
            return await OpenHashConfig.get(layer, '/chain/verify');
        } catch (e) {
            return { error: e.message };
        }
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const addBlockBtn = document.getElementById('addBlockBtn');
    const verifyChainBtn = document.getElementById('verifyChainBtn');
    const tamperBtn = document.getElementById('tamperBtn');
    const tamperTarget = document.getElementById('tamperTarget');
    const chainViz = document.getElementById('chainViz');
    const logArea = document.getElementById('logArea');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('nodeStatusText');
    const layerSelect = document.getElementById('layerSelect');

    // Merkle Tree 요소
    const addMerkleTxBtn = document.getElementById('addMerkleTxBtn');
    const clearMerkleBtn = document.getElementById('clearMerkleBtn');
    const merkleTxInput = document.getElementById('merkleTxInput');
    const merkleTreeViz = document.getElementById('merkleTreeViz');
    const merkleRootDisplay = document.getElementById('merkleRoot');

    let currentLayerId = 'KR-JEJU-SEOGWIPO-JUNGMUN';

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.innerHTML = '<span class="log-time">[' + new Date().toLocaleTimeString() + ']</span> ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // 노드 연결 확인
    const connected = await OpenHashConfig.checkConnection();
    if (statusIcon) statusIcon.classList.add(connected ? 'online' : 'offline');
    if (statusText) statusText.textContent = connected ? 'L1 노드 연결됨' : '시뮬레이션 모드';
    log(connected ? '✅ 노드 연결 성공' : '⚡ 시뮬레이션 모드', connected ? 'success' : 'warning');

    function renderChain() {
        if (!chainViz) return;
        chainViz.innerHTML = '';
        
        HashChainSimulator.chain.forEach((block, idx) => {
            if (idx > 0) {
                const arrow = document.createElement('div');
                arrow.className = 'chain-arrow';
                arrow.innerHTML = '→';
                chainViz.appendChild(arrow);
            }
            
            const blockEl = document.createElement('div');
            blockEl.className = 'block-item';
            blockEl.id = 'block-' + idx;
            blockEl.innerHTML = `
                <div class="block-header">
                    <span class="block-index">#${block.index}</span>
                    <span class="block-layer">${block.layerId}</span>
                </div>
                <div class="block-hash" title="${block.hash}">${block.hash.substring(0, 18)}...</div>
                <div class="block-data">${idx === 0 ? 'Genesis' : (block.data.transactions?.[0] || '').substring(0, 20)}</div>
                <div class="block-prev">← ${block.prevHash.substring(0, 12)}...</div>
            `;
            chainViz.appendChild(blockEl);
        });

        if (tamperTarget) {
            tamperTarget.innerHTML = '<option value="">선택</option>';
            for (let i = 1; i < HashChainSimulator.chain.length; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = 'Block #' + i;
                tamperTarget.appendChild(opt);
            }
        }
    }

    function updateBlockStatus(results) {
        results.forEach(r => {
            const blockEl = document.getElementById('block-' + r.index);
            if (blockEl) {
                blockEl.classList.remove('valid', 'invalid');
                blockEl.classList.add(r.valid ? 'valid' : 'invalid');
            }
        });
    }

    // ========== Merkle Tree 렌더링 ==========
    function renderMerkleTree(tree) {
        if (!merkleTreeViz) return;
        merkleTreeViz.innerHTML = '';
        
        if (!tree.root) {
            merkleTreeViz.innerHTML = '<div class="merkle-empty">거래를 추가하세요</div>';
            if (merkleRootDisplay) merkleRootDisplay.textContent = '-';
            return;
        }

        // 루트 표시
        if (merkleRootDisplay) {
            merkleRootDisplay.textContent = tree.root.substring(0, 16) + '...';
        }

        // 레벨별 렌더링 (위에서 아래로)
        const reversedLevels = [...tree.levels].reverse();
        
        reversedLevels.forEach((level, levelIdx) => {
            const levelDiv = document.createElement('div');
            levelDiv.className = 'merkle-level';
            
            const levelLabel = document.createElement('div');
            levelLabel.className = 'level-label';
            if (levelIdx === 0) {
                levelLabel.textContent = 'Root';
            } else if (levelIdx === reversedLevels.length - 1) {
                levelLabel.textContent = 'Leaves (TX)';
            } else {
                levelLabel.textContent = 'Level ' + (reversedLevels.length - levelIdx - 1);
            }
            levelDiv.appendChild(levelLabel);

            const nodesDiv = document.createElement('div');
            nodesDiv.className = 'merkle-nodes';
            
            level.forEach((node, nodeIdx) => {
                const nodeEl = document.createElement('div');
                nodeEl.className = 'merkle-node' + (node.isDuplicate ? ' duplicate' : '') + (levelIdx === 0 ? ' root' : '') + (node.isLeaf ? ' leaf' : '');
                nodeEl.innerHTML = `
                    <div class="node-hash">${node.hash.substring(0, 8)}...</div>
                    ${node.isLeaf ? '<div class="node-data">' + (node.data || '').substring(0, 10) + '</div>' : ''}
                `;
                nodesDiv.appendChild(nodeEl);
            });
            
            levelDiv.appendChild(nodesDiv);
            merkleTreeViz.appendChild(levelDiv);
            
            // 연결선 (마지막 레벨 제외)
            if (levelIdx < reversedLevels.length - 1) {
                const connectorDiv = document.createElement('div');
                connectorDiv.className = 'merkle-connectors';
                connectorDiv.innerHTML = '↓'.repeat(Math.max(1, Math.ceil(level.length / 2)));
                merkleTreeViz.appendChild(connectorDiv);
            }
        });
    }

    // 체인 초기화
    async function initChain() {
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        
        if (OpenHashConfig.isBackend()) {
            log('📡 Backend 체인 조회 중...', 'info');
            const apiChain = await HashChainSimulator.getChainAPI(1);
            
            if (!apiChain.error && apiChain.chain) {
                HashChainSimulator.chain = apiChain.chain;
                log('✅ Backend 체인 로드: ' + apiChain.chain.length + '개 블록', 'success');
            } else {
                log('⚠️ Backend 체인 없음, Mock 생성', 'warning');
                HashChainSimulator.initChain(currentLayerId);
            }
        } else {
            log('⚡ Mock 체인 생성', 'info');
            HashChainSimulator.initChain(currentLayerId);
        }
        
        log('✅ Genesis 블록 생성', 'success');
        renderChain();
        renderMerkleTree({ root: null, levels: [] });
    }

    // 블록 추가
    async function addBlock() {
        const txData = document.getElementById('txData')?.value || 'Transaction ' + Date.now();
        
        log('📦 블록 추가 중...', 'info');
        
        if (OpenHashConfig.isBackend()) {
            const result = await OpenHashConfig.post(1, '/transaction', {
                sender: 'alice', receiver: 'bob', amount: 100, memo: txData
            });
            if (!result.error) log('✅ Backend 거래 기록됨', 'success');
        }
        
        const block = HashChainSimulator.addBlock(txData, currentLayerId);
        log('✅ Block #' + block.index + ' 추가됨', 'success');
        renderChain();
    }

    // 블록 변조
    function tamperBlock() {
        const idx = parseInt(tamperTarget?.value);
        if (!idx || idx <= 0) {
            log('⚠️ 변조할 블록을 선택하세요', 'warning');
            return;
        }
        
        log('🔓 Block #' + idx + ' 변조 시도...', 'warning');
        const success = HashChainSimulator.tamperBlock(idx);
        if (success) {
            log('⚠️ Block #' + idx + ' 데이터 변조됨!', 'error');
            renderChain();
        }
    }

    // 체인 검증
    async function verifyChain() {
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🔍 체인 무결성 검증...', 'info');
        
        if (OpenHashConfig.isBackend()) {
            const apiResult = await HashChainSimulator.verifyChainAPI(1);
            if (!apiResult.error && apiResult.valid !== undefined) {
                log('📡 Backend 검증: ' + (apiResult.valid ? '유효' : '무효'), apiResult.valid ? 'success' : 'error');
            }
        }
        
        const results = HashChainSimulator.verifyChain();
        let allValid = true;
        
        results.forEach(r => {
            const details = [];
            if (!r.hashValid) details.push('해시 불일치');
            if (!r.linkValid) details.push('링크 끊김');
            log('Block #' + r.index + ': ' + (r.valid ? '✅' : '❌') + (details.length ? ' (' + details.join(', ') + ')' : ''), r.valid ? 'success' : 'error');
            if (!r.valid) allValid = false;
        });
        
        updateBlockStatus(results);
        log(allValid ? '✅ 체인 무결성 통과' : '❌ 체인 무결성 실패', allValid ? 'success' : 'error');
        showResultModal(allValid);
    }

    // ========== Merkle Tree 이벤트 ==========
    async function addMerkleTransaction() {
        const tx = merkleTxInput?.value || 'TX-' + Date.now();
        log('🌳 Merkle TX 추가: ' + tx, 'info');
        
        const tree = HashChainSimulator.addMerkleTransaction(tx);
        
        // 단계별 애니메이션
        await animateMerkleBuilding(tree);
        
        log('✅ Merkle Root: ' + (tree.root?.substring(0, 16) || '-') + '...', 'success');
        if (merkleTxInput) merkleTxInput.value = '';
    }

    async function animateMerkleBuilding(tree) {
        if (!merkleTreeViz) return;
        
        // 먼저 전체 구조 렌더링 (투명하게)
        renderMerkleTree(tree);
        
        // 각 노드를 순차적으로 활성화
        const nodes = merkleTreeViz.querySelectorAll('.merkle-node');
        for (let i = nodes.length - 1; i >= 0; i--) {
            nodes[i].classList.add('building');
            await new Promise(r => setTimeout(r, 150));
            nodes[i].classList.remove('building');
            nodes[i].classList.add('built');
        }
    }

    function clearMerkle() {
        HashChainSimulator.clearMerkleTransactions();
        renderMerkleTree({ root: null, levels: [] });
        log('🗑️ Merkle 트리 초기화', 'info');
    }

    function showResultModal(valid) {
        const existingModal = document.getElementById('resultModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'resultModal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content ${valid ? 'success' : 'fail'}">
                <div class="modal-header">
                    <span class="modal-icon">${valid ? '✅' : '❌'}</span>
                    <h3>${valid ? '무결성 검증 통과' : '무결성 검증 실패'}</h3>
                </div>
                <div class="modal-body">
                    <div class="result-text">${valid ? '모든 블록의 해시 체인이 유효합니다.' : '변조된 블록이 감지되었습니다.'}</div>
                </div>
                <button class="modal-close" onclick="this.closest('.result-modal').remove()">확인</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // 이벤트 바인딩
    if (addBlockBtn) addBlockBtn.addEventListener('click', addBlock);
    if (verifyChainBtn) verifyChainBtn.addEventListener('click', verifyChain);
    if (tamperBtn) tamperBtn.addEventListener('click', tamperBlock);
    if (addMerkleTxBtn) addMerkleTxBtn.addEventListener('click', addMerkleTransaction);
    if (clearMerkleBtn) clearMerkleBtn.addEventListener('click', clearMerkle);
    
    if (layerSelect) {
        layerSelect.addEventListener('change', function() {
            currentLayerId = this.value;
            log('계층 변경: ' + currentLayerId, 'info');
        });
    }

    await initChain();
});
