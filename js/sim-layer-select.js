/**
 * OpenHash Layer Select Simulator
 * 확률적 계층 선택 - API 연동 + 단계별 애니메이션
 */
const LayerSelectSimulator = {
    // 5단계 중요도별 확률 분포 [L1, L2, L3, L4, L5]
    probabilities: {
        trivial:   [70, 20, 7, 2, 1],    // 일상
        normal:    [50, 30, 12, 6, 2],   // 일반
        important: [30, 35, 20, 10, 5],  // 중요
        high:      [15, 25, 30, 20, 10], // 고중요
        critical:  [5, 15, 30, 30, 20]   // 최고중요
    },
    layerNames: ['L1 읍면동', 'L2 시군구', 'L3 광역시도', 'L4 국가', 'L5 글로벌'],
    apiConnected: false,

    // 노드 상태 확인
    async checkNodeStatus() {
        try {
            const data = await OpenHashConfig.get(1, '/health');
            this.apiConnected = data.status === 'healthy';
            return this.apiConnected;
        } catch (e) {
            this.apiConnected = false;
            return false;
        }
    },

    // SHA-256 시뮬레이션
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

    // 계층 선택 로직
    selectLayer(data, importance) {
        const timestamp = Date.now().toString();
        const nonce = Math.random().toString(36).substring(2, 10);
        
        // Step 1: 원본 데이터
        const original = data;
        
        // Step 2: SHA-256 해시
        const hash1 = this.simpleHash(original);
        
        // Step 3: 이중 해시 (+ timestamp + nonce)
        const combined = hash1 + timestamp + nonce;
        const hash2 = this.simpleHash(combined);
        
        // Step 4: 선택자 값 (0-99)
        const selectorValue = parseInt(hash2.slice(-4), 16) % 100;
        
        // 확률 분포에 따른 계층 선택
        const probs = this.probabilities[importance] || this.probabilities.normal;
        let cumulative = 0;
        let selectedLayer = 1;
        
        for (let i = 0; i < probs.length; i++) {
            cumulative += probs[i];
            if (selectorValue < cumulative) {
                selectedLayer = i + 1;
                break;
            }
        }

        return {
            original,
            timestamp,
            nonce,
            hash1,
            hash2,
            selectorValue,
            selectedLayer,
            layerName: this.layerNames[selectedLayer - 1],
            probability: probs[selectedLayer - 1]
        };
    },

    // 확률 분포 그래프 업데이트
    updateProbDisplay(importance) {
        const probs = this.probabilities[importance] || this.probabilities.normal;
        for (let i = 1; i <= 5; i++) {
            const bar = document.getElementById('barL' + i);
            const pct = document.getElementById('pctL' + i);
            if (bar) bar.style.width = probs[i-1] + '%';
            if (pct) pct.textContent = probs[i-1] + '%';
        }
    },

    // 선택된 계층 하이라이트
    highlightSelectedLayer(layer) {
        for (let i = 1; i <= 5; i++) {
            const bar = document.getElementById('barL' + i);
            if (bar) {
                bar.classList.toggle('selected', i === layer);
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const runBtn = document.getElementById('runSimBtn');
    const runBatchBtn = document.getElementById('runBatchBtn');
    const logArea = document.getElementById('logArea');
    const importanceSelect = document.getElementById('importance');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('nodeStatusText');

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.innerHTML = '<span class="log-time">[' + new Date().toLocaleTimeString() + ']</span> ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // 초기 노드 상태 확인
    const connected = await LayerSelectSimulator.checkNodeStatus();
    statusIcon.classList.add(connected ? 'online' : 'offline');
    statusText.textContent = connected ? 'L1 노드 연결됨' : '시뮬레이션 모드';
    log(connected ? '✅ 노드 연결 성공' : '⚡ 시뮬레이션 모드', connected ? 'success' : 'warning');

    // 중요도 변경 시 확률 분포 업데이트
    if (importanceSelect) {
        importanceSelect.addEventListener('change', function() {
            LayerSelectSimulator.updateProbDisplay(this.value);
            LayerSelectSimulator.highlightSelectedLayer(0); // 하이라이트 초기화
            log('중요도 변경: ' + this.options[this.selectedIndex].text, 'info');
        });
        // 초기 확률 분포 설정
        LayerSelectSimulator.updateProbDisplay(importanceSelect.value);
    }

    // 단계별 애니메이션
    async function animateStep(stepNum, value, delay = 200) {
        return new Promise(resolve => {
            setTimeout(() => {
                const step = document.getElementById('step' + stepNum);
                if (step) {
                    // 이전 단계들 done 처리
                    for (let i = 1; i < stepNum; i++) {
                        const prevStep = document.getElementById('step' + i);
                        if (prevStep) {
                            prevStep.classList.remove('active');
                            prevStep.classList.add('done');
                        }
                    }
                    // 현재 단계 active
                    step.classList.add('active');
                    
                    // 값 업데이트
                    const valueIds = ['originalData', 'firstHash', 'doubleHash', 'selectorValue'];
                    const valueEl = document.getElementById(valueIds[stepNum - 1]);
                    if (valueEl) {
                        valueEl.textContent = value;
                    }
                }
                resolve();
            }, delay);
        });
    }

    // 모든 단계 초기화
    function resetSteps() {
        for (let i = 1; i <= 4; i++) {
            const step = document.getElementById('step' + i);
            if (step) {
                step.classList.remove('active', 'done');
            }
        }
        document.getElementById('originalData').textContent = '-';
        document.getElementById('firstHash').textContent = '-';
        document.getElementById('doubleHash').textContent = '-';
        document.getElementById('selectorValue').textContent = '-';
    }

    // 결과 모달 표시
    function showResultModal(result) {
        // 기존 모달 제거
        const existingModal = document.getElementById('resultModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'resultModal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-icon">🎯</span>
                    <h3>계층 선택 완료</h3>
                </div>
                <div class="modal-body">
                    <div class="result-layer">${result.layerName}</div>
                    <div class="result-details">
                        <div class="detail-row"><span>선택자 값:</span><strong>${result.selectorValue}</strong></div>
                        <div class="detail-row"><span>선택 확률:</span><strong>${result.probability}%</strong></div>
                    </div>
                </div>
                <button class="modal-close" onclick="this.closest('.result-modal').remove()">확인</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 애니메이션
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // 시뮬레이션 실행
    async function runSimulation() {
        runBtn.disabled = true;
        runBtn.textContent = '실행 중...';
        resetSteps();

        const dataContent = document.getElementById('dataContent')?.value || 'test-data';
        const importance = importanceSelect?.value || 'normal';

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🎲 계층 선택 시작 (중요도: ' + importance + ')', 'info');

        const result = LayerSelectSimulator.selectLayer(dataContent, importance);

        // Step 1: 원본 데이터 (0.2초)
        await animateStep(1, result.original.substring(0, 30) + (result.original.length > 30 ? '...' : ''), 200);
        log('📄 원본 데이터 로드', 'info');

        // Step 2: SHA-256 해시 (0.3초)
        await animateStep(2, result.hash1.substring(0, 32) + '...', 300);
        log('🔐 SHA-256 해시: ' + result.hash1.substring(0, 16) + '...', 'info');

        // Step 3: 이중 해시 (0.3초)
        await animateStep(3, result.hash2.substring(0, 32) + '...', 300);
        log('🔐 이중 해시 적용 (+ timestamp + nonce)', 'info');

        // Step 4: 선택자 값 (0.2초)
        await animateStep(4, result.selectorValue, 200);
        document.getElementById('step4').classList.remove('active');
        document.getElementById('step4').classList.add('done');
        log('🎯 선택자 값: ' + result.selectorValue + ' → ' + result.layerName, 'success');

        // 확률 분포에서 선택된 계층 하이라이트
        LayerSelectSimulator.highlightSelectedLayer(result.selectedLayer);

        // 결과 모달 표시
        setTimeout(() => showResultModal(result), 300);

        log('✅ 계층 선택 완료: ' + result.layerName + ' (확률 ' + result.probability + '%)', 'success');
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

        runBtn.disabled = false;
        runBtn.textContent = '계층 선택 실행';
    }

    // 배치 실행
    async function runBatch() {
        runBatchBtn.disabled = true;
        runBatchBtn.textContent = '실행 중...';

        const importance = importanceSelect?.value || 'normal';
        const counts = [0, 0, 0, 0, 0];

        log('📊 100회 배치 실행 시작...', 'info');

        for (let i = 0; i < 100; i++) {
            const result = LayerSelectSimulator.selectLayer('batch-test-' + i + '-' + Date.now(), importance);
            counts[result.selectedLayer - 1]++;
        }

        // 결과 표시
        const batchResult = document.getElementById('batchResult');
        const batchStats = document.getElementById('batchStats');
        
        batchStats.innerHTML = counts.map((count, i) => `
            <div class="batch-stat">
                <div class="batch-stat-label">L${i+1}</div>
                <div class="batch-stat-value">${count}회</div>
            </div>
        `).join('');
        
        batchResult.style.display = 'block';
        log('✅ 배치 완료: L1=' + counts[0] + ', L2=' + counts[1] + ', L3=' + counts[2] + ', L4=' + counts[3] + ', L5=' + counts[4], 'success');

        runBatchBtn.disabled = false;
        runBatchBtn.textContent = '100회 배치 실행';
    }

    if (runBtn) runBtn.addEventListener('click', runSimulation);
    if (runBatchBtn) runBatchBtn.addEventListener('click', runBatch);
});
