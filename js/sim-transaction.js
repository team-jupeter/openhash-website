/**
 * OpenHash Transaction Simulator
 * 거래 시뮬레이션 - API 연동 버전
 */
const TxSimulator = {
    regions: {
        'KR-JEJU-SEOGWIPO-JUNGMUN': {
            name: '제주 서귀포시 중문동',
            layer: 1,
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-SEOGWIPO', 'KR-JEJU-SEOGWIPO-JUNGMUN']
        },
        'KR-JEJU-SEOGWIPO-DAEJEONG': {
            name: '제주 서귀포시 대정읍',
            layer: 2,
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-SEOGWIPO', 'KR-JEJU-SEOGWIPO-DAEJEONG']
        },
        'KR-JEJU-JEJU-NOHYEONG': {
            name: '제주 제주시 노형동',
            layer: 3,
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-JEJU', 'KR-JEJU-JEJU-NOHYEONG']
        },
        'KR-SEOUL-GANGNAM-YEOKSAM': {
            name: '서울 강남구 역삼동',
            layer: 4,
            hierarchy: ['GLOBAL', 'KR', 'KR-SEOUL', 'KR-SEOUL-GANGNAM', 'KR-SEOUL-GANGNAM-YEOKSAM']
        },
        'KR-BUSAN-HAEUNDAE-U': {
            name: '부산 해운대구 우동',
            layer: 4,
            hierarchy: ['GLOBAL', 'KR', 'KR-BUSAN', 'KR-BUSAN-HAEUNDAE', 'KR-BUSAN-HAEUNDAE-U']
        }
    },
    layerNames: ['L5 글로벌', 'L4 국가', 'L3 광역시도', 'L2 시군구', 'L1 읍면동'],

    findCommonLayer(sender, receiver) {
        const sH = this.regions[sender].hierarchy;
        const rH = this.regions[receiver].hierarchy;
        for (let i = 4; i >= 0; i--) {
            if (sH[i] === rH[i]) {
                return { level: i, name: this.layerNames[i], code: sH[i], apiLayer: 5 - i };
            }
        }
        return { level: 0, name: this.layerNames[0], code: 'GLOBAL', apiLayer: 4 };
    },

    // Mock 검증
    runVerification(amount) {
        const steps = [];
        const senderBalance = 1000000;

        // Step 1: 잔액 확인
        if (senderBalance < amount) {
            steps.push({ name: '잔액 확인', pass: false, msg: '잔액 부족' });
            return { success: false, steps, failAt: 1 };
        }
        steps.push({ name: '잔액 확인', pass: true, msg: '잔액 충분' });

        // Step 2: 신원 확인
        steps.push({ name: '신원 확인', pass: true, msg: 'DID 인증됨' });

        // Step 3: 한도 확인
        if (amount > 100000000) {
            steps.push({ name: '한도 확인', pass: false, msg: '한도 초과' });
            return { success: false, steps, failAt: 3 };
        }
        steps.push({ name: '한도 확인', pass: true, msg: '한도 이내' });

        // Step 4: 이상 탐지
        const aiScore = (Math.random() * 0.4).toFixed(3);
        steps.push({ name: 'AI 이상 탐지', pass: true, msg: '점수: ' + aiScore });

        // Step 5: 규정 준수
        steps.push({ name: '규정 준수', pass: true, msg: 'AML 통과' });

        return { success: true, steps };
    },

    // 실제 API 거래 생성
    async createTransactionAPI(sender, receiver, amount) {
        const common = this.findCommonLayer(sender, receiver);
        const targetLayer = Math.min(common.apiLayer, 4);
        
        try {
            const result = await OpenHashConfig.post(targetLayer, '/transaction', {
                sender: sender,
                receiver: receiver,
                amount: amount,
                timestamp: new Date().toISOString()
            });
            return { success: !result.error, data: result, layer: targetLayer };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('nodeStatusText');

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.innerHTML = '<span class="log-time">[' + new Date().toLocaleTimeString() + ']</span> ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    // 노드 연결 확인
    log('노드 연결 확인 중...', 'info');
    const connected = await OpenHashConfig.checkConnection();
    
    if (statusIcon) statusIcon.classList.add(connected ? 'online' : 'offline');
    if (statusText) statusText.textContent = connected ? 'L1~L4 노드 연결됨' : '시뮬레이션 모드';
    log(connected ? '✅ 노드 연결 성공' : '⚡ 시뮬레이션 모드', connected ? 'success' : 'warning');

    function resetUI() {
        for (let i = 1; i <= 5; i++) {
            const step = document.getElementById('step' + i);
            if (step) {
                step.classList.remove('active', 'pass', 'fail');
                const status = step.querySelector('.step-status');
                if (status) status.textContent = '-';
            }
        }
        const commonBox = document.getElementById('commonLayerBox');
        if (commonBox) commonBox.classList.remove('found');
        const commonText = document.getElementById('commonLayerText');
        if (commonText) commonText.textContent = '-';
    }

    async function animateStep(stepNum, pass, msg, delay = 300) {
        return new Promise(resolve => {
            setTimeout(() => {
                const step = document.getElementById('step' + stepNum);
                if (step) {
                    step.classList.add('active');
                    setTimeout(() => {
                        step.classList.remove('active');
                        step.classList.add(pass ? 'pass' : 'fail');
                        const status = step.querySelector('.step-status');
                        if (status) status.textContent = pass ? 'PASS' : 'FAIL';
                    }, 150);
                }
                resolve();
            }, delay);
        });
    }

    function showResultModal(success, common, elapsed) {
        const existingModal = document.getElementById('resultModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'resultModal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content ${success ? 'success' : 'fail'}">
                <div class="modal-header">
                    <span class="modal-icon">${success ? '✅' : '❌'}</span>
                    <h3>${success ? '거래 승인' : '거래 거부'}</h3>
                </div>
                <div class="modal-body">
                    <div class="result-text">공통 계층: ${common.name}</div>
                    <div class="result-text">처리 시간: ${elapsed}ms</div>
                </div>
                <button class="modal-close" onclick="this.closest('.result-modal').remove()">확인</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    async function runSimulation() {
        resetUI();
        runBtn.disabled = true;
        runBtn.textContent = '실행 중...';

        const sender = document.getElementById('senderRegion').value;
        const receiver = document.getElementById('receiverRegion').value;
        const amount = parseInt(document.getElementById('txAmount').value) || 0;

        const senderName = TxSimulator.regions[sender]?.name || sender;
        const receiverName = TxSimulator.regions[receiver]?.name || receiver;

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🚀 거래 시뮬레이션 시작', 'info');
        log('송신: ' + senderName, 'info');
        log('수신: ' + receiverName, 'info');
        log('금액: ' + amount.toLocaleString() + ' T', 'info');

        const startTime = performance.now();

        // 공통 계층 탐색
        const common = TxSimulator.findCommonLayer(sender, receiver);
        await new Promise(r => setTimeout(r, 300));
        
        const commonText = document.getElementById('commonLayerText');
        const commonBox = document.getElementById('commonLayerBox');
        if (commonText) commonText.textContent = common.name + ' (' + common.code + ')';
        if (commonBox) commonBox.classList.add('found');
        log('✅ 공통 계층: ' + common.name, 'success');

        let result;

        // Backend 모드 + 연결됨
        if (OpenHashConfig.isBackend()) {
            log('📡 Backend API 호출 중...', 'info');
            const apiResult = await TxSimulator.createTransactionAPI(sender, receiver, amount);
            
            if (apiResult.success) {
                // API 성공 시 5단계 모두 통과로 표시
                for (let i = 1; i <= 5; i++) {
                    await animateStep(i, true, 'PASS', 200);
                }
                const txId = apiResult.data.transactionId || apiResult.data.txId || 'TX-' + Date.now();
                log('✅ 거래 ID: ' + txId, 'success');
                result = { success: true, steps: [] };
            } else {
                log('❌ API 오류: ' + (apiResult.error || '알 수 없음'), 'error');
                result = { success: false, steps: [] };
            }
        } else {
            // Mock-up 모드
            log('⚡ Mock-up 시뮬레이션 실행', 'info');
            result = TxSimulator.runVerification(amount);

            for (let i = 0; i < result.steps.length; i++) {
                const step = result.steps[i];
                await animateStep(i + 1, step.pass, step.msg, 350);
                log((step.pass ? '✅' : '❌') + ' Step ' + (i + 1) + ' ' + step.name + ': ' + step.msg, step.pass ? 'success' : 'error');
                
                if (!step.pass) break;
            }
        }

        const elapsed = (performance.now() - startTime).toFixed(2);

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('⏱️ 처리 시간: ' + elapsed + 'ms', 'success');
        log(result.success ? '✅ 거래 승인' : '❌ 거래 거부', result.success ? 'success' : 'error');

        showResultModal(result.success, common, elapsed);

        runBtn.disabled = false;
        runBtn.textContent = '시뮬레이션 실행';
    }

    if (runBtn) {
        runBtn.addEventListener('click', runSimulation);
    }
});
