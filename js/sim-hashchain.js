const HashChainSimulator = {
    chain: [],

    simpleHash: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const hex = Math.abs(hash).toString(16).padStart(8, '0');
        return '0x' + (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 62);
    },

    calculateBlockHash: function(block) {
        const content = JSON.stringify({
            index: block.index,
            timestamp: block.timestamp,
            data: block.data,
            prevHash: block.prevHash,
            layerId: block.layerId
        });
        return this.simpleHash(content);
    },

    createGenesisBlock: function(layerId) {
        const block = {
            index: 0,
            timestamp: new Date().toISOString(),
            data: { message: 'OpenHash Genesis Block', layerId },
            prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            layerId: layerId
        };
        block.hash = this.calculateBlockHash(block);
        return block;
    },

    createBlock: function(data, layerId) {
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

    initChain: function(layerId) {
        this.chain = [this.createGenesisBlock(layerId)];
        return this.chain;
    },

    addBlock: function(data, layerId) {
        const block = this.createBlock(data, layerId);
        this.chain.push(block);
        return block;
    },

    tamperBlock: function(index) {
        if (index <= 0 || index >= this.chain.length) return false;
        this.chain[index].data.transactions[0] = '[TAMPERED] ' + this.chain[index].data.transactions[0];
        // 해시는 재계산하지 않아 불일치 발생
        return true;
    },

    verifyChain: function() {
        const results = [];
        for (let i = 0; i < this.chain.length; i++) {
            const block = this.chain[i];
            const computedHash = this.calculateBlockHash(block);
            const hashValid = computedHash === block.hash;
            
            let linkValid = true;
            if (i > 0) {
                linkValid = block.prevHash === this.chain[i - 1].hash;
            }

            results.push({
                index: i,
                hashValid,
                linkValid,
                valid: hashValid && linkValid
            });
        }
        return results;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const addBlockBtn = document.getElementById('addBlockBtn');
    const verifyChainBtn = document.getElementById('verifyChainBtn');
    const tamperBtn = document.getElementById('tamperBtn');
    const tamperTarget = document.getElementById('tamperTarget');
    const chainViz = document.getElementById('chainViz');
    const logArea = document.getElementById('logArea');

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function renderChain() {
        chainViz.innerHTML = '';
        
        HashChainSimulator.chain.forEach((block, idx) => {
            if (idx > 0) {
                const link = document.createElement('div');
                link.className = 'block-link';
                link.innerHTML = '🔗 ↓';
                chainViz.appendChild(link);
            }

            const blockEl = document.createElement('div');
            blockEl.className = 'block-item' + (idx === 0 ? ' genesis' : '');
            blockEl.dataset.index = idx;
            
            const dataStr = idx === 0 
                ? block.data.message 
                : (block.data.transactions ? block.data.transactions[0] : JSON.stringify(block.data));

            blockEl.innerHTML = `
                <div class="block-header">
                    <span class="block-index">${idx === 0 ? 'Genesis Block' : 'Block #' + idx}</span>
                    <span class="block-time">${new Date(block.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="block-body">
                    <div class="block-field">
                        <div class="field-label">Data</div>
                        <div class="field-value">${dataStr}</div>
                    </div>
                    <div class="block-field">
                        <div class="field-label">Hash</div>
                        <div class="field-value">${block.hash.substring(0, 30)}...</div>
                    </div>
                    <div class="block-field">
                        <div class="field-label">Prev Hash</div>
                        <div class="field-value">${block.prevHash.substring(0, 30)}...</div>
                    </div>
                </div>
            `;
            chainViz.appendChild(blockEl);
        });

        // 블록 수 업데이트
        document.getElementById('blockCount').textContent = HashChainSimulator.chain.length;

        // 변조 대상 선택 옵션 업데이트
        tamperTarget.innerHTML = '<option value="">선택하세요</option>';
        HashChainSimulator.chain.forEach((block, idx) => {
            if (idx > 0) {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = 'Block #' + idx;
                tamperTarget.appendChild(opt);
            }
        });
    }

    function updateIntegrityStatus(isValid) {
        const status = document.getElementById('integrityStatus');
        if (isValid) {
            status.textContent = '✓ 유효';
            status.className = 'status-valid';
        } else {
            status.textContent = '✗ 손상됨';
            status.className = 'status-invalid';
        }
    }

    // 초기화
    const initialLayerId = document.getElementById('layerId').value;
    HashChainSimulator.initChain(initialLayerId);
    renderChain();

    // 블록 추가
    addBlockBtn.addEventListener('click', function() {
        const data = document.getElementById('blockData').value || '빈 블록';
        const layerId = document.getElementById('layerId').value;
        
        const block = HashChainSimulator.addBlock(data, layerId);
        renderChain();
        
        // 새 블록 애니메이션
        const blocks = chainViz.querySelectorAll('.block-item');
        blocks[blocks.length - 1].classList.add('new');
        
        log('블록 #' + block.index + ' 추가됨: ' + data.substring(0, 30), 'success');
        
        // 검증 결과 영역 숨기기
        document.getElementById('verifyResultArea').style.display = 'none';
        updateIntegrityStatus(true);
    });

    // 체인 검증
    verifyChainBtn.addEventListener('click', function() {
        log('=== 체인 무결성 검증 시작 ===');
        const results = HashChainSimulator.verifyChain();
        
        const resultArea = document.getElementById('verifyResultArea');
        const details = document.getElementById('verifyDetails');
        details.innerHTML = '';
        
        let allValid = true;
        results.forEach(r => {
            const item = document.createElement('div');
            item.className = 'verify-item ' + (r.valid ? 'pass' : 'fail');
            
            let msg = r.index === 0 ? 'Genesis Block: ' : 'Block #' + r.index + ': ';
            if (r.valid) {
                msg += '✓ 유효';
            } else {
                msg += '✗ ';
                if (!r.hashValid) msg += '해시 불일치 ';
                if (!r.linkValid) msg += '링크 손상';
                allValid = false;
            }
            
            item.textContent = msg;
            details.appendChild(item);
            
            // 블록 UI 업데이트
            const blockEl = chainViz.querySelector('.block-item[data-index="' + r.index + '"]');
            if (blockEl) {
                blockEl.classList.remove('valid', 'invalid');
                blockEl.classList.add(r.valid ? 'valid' : 'invalid');
            }
            
            log(msg, r.valid ? 'success' : 'error');
        });

        // 링크 상태 업데이트
        const links = chainViz.querySelectorAll('.block-link');
        results.slice(1).forEach((r, idx) => {
            if (links[idx]) {
                links[idx].classList.remove('valid', 'invalid');
                links[idx].classList.add(r.linkValid ? 'valid' : 'invalid');
            }
        });
        
        resultArea.style.display = 'block';
        updateIntegrityStatus(allValid);
        log('=== 검증 완료: ' + (allValid ? '체인 유효' : '체인 손상 감지') + ' ===', allValid ? 'success' : 'error');
    });

    // 변조 대상 선택
    tamperTarget.addEventListener('change', function() {
        tamperBtn.disabled = !this.value;
    });

    // 블록 변조
    tamperBtn.addEventListener('click', function() {
        const index = parseInt(tamperTarget.value);
        if (!index) return;
        
        HashChainSimulator.tamperBlock(index);
        renderChain();
        
        log('⚠️ Block #' + index + ' 데이터 변조됨!', 'error');
        log('체인 검증을 실행하여 손상을 확인하세요.', 'warn');
        
        // 변조된 블록 표시
        const blockEl = chainViz.querySelector('.block-item[data-index="' + index + '"]');
        if (blockEl) {
            blockEl.classList.add('invalid');
        }
    });
});
