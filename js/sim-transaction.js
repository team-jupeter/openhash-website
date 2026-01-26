const TxSimulator = {
    regions: {
        'KR-JEJU-SEOGWIPO-JUNGMUN': { 
            name: '제주 서귀포시 중문동', 
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-SEOGWIPO', 'KR-JEJU-SEOGWIPO-JUNGMUN']
        },
        'KR-JEJU-SEOGWIPO-DAEJEONG': { 
            name: '제주 서귀포시 대정읍', 
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-SEOGWIPO', 'KR-JEJU-SEOGWIPO-DAEJEONG']
        },
        'KR-JEJU-JEJU-NOHYEONG': { 
            name: '제주 제주시 노형동', 
            hierarchy: ['GLOBAL', 'KR', 'KR-JEJU', 'KR-JEJU-JEJU', 'KR-JEJU-JEJU-NOHYEONG']
        },
        'KR-SEOUL-GANGNAM-YEOKSAM': { 
            name: '서울 강남구 역삼동', 
            hierarchy: ['GLOBAL', 'KR', 'KR-SEOUL', 'KR-SEOUL-GANGNAM', 'KR-SEOUL-GANGNAM-YEOKSAM']
        },
        'KR-BUSAN-HAEUNDAE-U': { 
            name: '부산 해운대구 우동', 
            hierarchy: ['GLOBAL', 'KR', 'KR-BUSAN', 'KR-BUSAN-HAEUNDAE', 'KR-BUSAN-HAEUNDAE-U']
        },
        'US-CA-LA-DOWNTOWN': { 
            name: '미국 LA 다운타운', 
            hierarchy: ['GLOBAL', 'US', 'US-CA', 'US-CA-LA', 'US-CA-LA-DOWNTOWN']
        },
        'JP-TOKYO-SHIBUYA-HARAJUKU': { 
            name: '일본 도쿄 시부야', 
            hierarchy: ['GLOBAL', 'JP', 'JP-TOKYO', 'JP-TOKYO-SHIBUYA', 'JP-TOKYO-SHIBUYA-HARAJUKU']
        }
    },
    layerNames: ['L5 글로벌', 'L4 국가', 'L3 광역시도', 'L2 시군구', 'L1 읍면동'],
    senderBalance: 1000000,
    receiverBalance: 500000,

    findCommonLayer: function(sender, receiver) {
        const sH = this.regions[sender].hierarchy;
        const rH = this.regions[receiver].hierarchy;
        for (let i = 4; i >= 0; i--) {
            if (sH[i] === rH[i]) {
                return { level: i, name: this.layerNames[i], code: sH[i] };
            }
        }
        return { level: 0, name: this.layerNames[0], code: 'GLOBAL' };
    },

    runVerification: function(amount, senderBal) {
        const steps = [];
        
        // Step 1: 잔액 확인
        if (senderBal < amount) {
            steps.push({ name: '잔액 확인', status: 'fail', msg: '잔액 부족' });
            return { success: false, steps, failAt: 1 };
        }
        steps.push({ name: '잔액 확인', status: 'pass', msg: '잔액 충분' });

        // Step 2: 신원 확인
        steps.push({ name: '신원 확인', status: 'pass', msg: '인증됨' });

        // Step 3: 한도 확인
        if (amount > 100000000) {
            steps.push({ name: '한도 확인', status: 'fail', msg: '한도 초과' });
            return { success: false, steps, failAt: 3 };
        }
        steps.push({ name: '한도 확인', status: 'pass', msg: '한도 이내' });

        // Step 4: 이상 탐지
        const aiScore = (Math.random() * 0.3).toFixed(3);
        steps.push({ name: '이상 탐지', status: 'pass', msg: 'AI: ' + aiScore });

        // Step 5: 규정 준수
        steps.push({ name: '규정 준수', status: 'pass', msg: 'AML 통과' });

        return { success: true, steps, aiScore };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const stepList = document.getElementById('stepList');
    const resultSummary = document.getElementById('resultSummary');

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function resetUI() {
        document.querySelectorAll('.step-item').forEach(item => {
            item.className = 'step-item';
            item.querySelector('.step-status').textContent = '-';
        });
        document.querySelectorAll('.tree-node').forEach(node => {
            node.classList.remove('highlight', 'common');
        });
        document.getElementById('commonIndicator').className = 'common-layer-indicator';
        document.getElementById('commonLayerText').textContent = '-';
        document.getElementById('senderDelta').textContent = '';
        document.getElementById('receiverDelta').textContent = '';
        document.getElementById('senderAfter').textContent = '-';
        document.getElementById('receiverAfter').textContent = '-';
        document.getElementById('balanceArrow').className = 'balance-arrow';
        document.getElementById('invariantCheck').className = 'invariant-check';
        resultSummary.style.display = 'none';
    }

    function animateStep(stepNum, status, msg, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                const item = document.querySelector('.step-item[data-step="' + stepNum + '"]');
                item.classList.add(status);
                item.querySelector('.step-status').textContent = msg;
                log('Step ' + stepNum + ': ' + msg, status === 'pass' ? 'success' : 'error');
                resolve();
            }, delay);
        });
    }

    async function runSimulation() {
        resetUI();
        runBtn.disabled = true;
        runBtn.textContent = '실행 중...';
        runBtn.classList.add('running');

        const sender = document.getElementById('senderRegion').value;
        const receiver = document.getElementById('receiverRegion').value;
        const amount = parseInt(document.getElementById('txAmount').value) || 0;

        log('시뮬레이션 시작: ' + TxSimulator.regions[sender].name + ' → ' + TxSimulator.regions[receiver].name);
        log('송금액: ' + amount.toLocaleString() + ' T');

        const startTime = performance.now();

        // 공통 계층 탐색 애니메이션
        log('공통 계층 탐색 중...');
        const common = TxSimulator.findCommonLayer(sender, receiver);
        
        await new Promise(r => setTimeout(r, 500));
        document.getElementById('commonLayerText').textContent = common.name + ' (' + common.code + ')';
        document.getElementById('commonIndicator').classList.add('found');
        log('공통 계층 발견: ' + common.name, 'success');

        // 5단계 검증
        const result = TxSimulator.runVerification(amount, TxSimulator.senderBalance);
        
        for (let i = 0; i < result.steps.length; i++) {
            await animateStep(i + 1, result.steps[i].status, result.steps[i].msg, 400);
        }

        // 잔액 변동 표시
        if (result.success) {
            await new Promise(r => setTimeout(r, 300));
            
            document.getElementById('senderDelta').textContent = '-' + amount.toLocaleString() + ' T';
            document.getElementById('senderDelta').classList.add('minus');
            document.getElementById('receiverDelta').textContent = '+' + amount.toLocaleString() + ' T';
            document.getElementById('receiverDelta').classList.add('plus');
            
            document.getElementById('balanceArrow').classList.add('active');
            
            await new Promise(r => setTimeout(r, 300));
            
            const newSender = TxSimulator.senderBalance - amount;
            const newReceiver = TxSimulator.receiverBalance + amount;
            document.getElementById('senderAfter').textContent = newSender.toLocaleString() + ' T';
            document.getElementById('receiverAfter').textContent = newReceiver.toLocaleString() + ' T';
            
            document.getElementById('invariantValue').textContent = 'Δ합계 = (-' + amount.toLocaleString() + ') + (+' + amount.toLocaleString() + ') = 0 ✓';
            
            log('잔액 불변성 검증 완료', 'success');
        } else {
            document.getElementById('invariantCheck').classList.add('error');
            document.getElementById('invariantValue').textContent = '거래 실패 - 검증 미통과';
            log('거래 실패: Step ' + result.failAt + '에서 중단', 'error');
        }

        const endTime = performance.now();
        const elapsed = (endTime - startTime).toFixed(2);

        // 결과 표시
        resultSummary.style.display = 'block';
        document.getElementById('resultCommon').textContent = common.name;
        document.getElementById('resultTime').textContent = elapsed + ' ms';
        document.getElementById('resultFinal').textContent = result.success ? '승인' : '거부';
        document.getElementById('resultFinal').className = 'result-value ' + (result.success ? 'success' : 'error');

        log('시뮬레이션 완료: ' + elapsed + 'ms', result.success ? 'success' : 'error');

        runBtn.disabled = false;
        runBtn.textContent = '시뮬레이션 실행';
        runBtn.classList.remove('running');
    }

    runBtn.addEventListener('click', runSimulation);
});
