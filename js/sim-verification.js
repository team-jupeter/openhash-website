const VerificationSimulator = {
    presets: {
        success: { balance: 1000000, amount: 50000, auth: 'verified', pattern: 'normal' },
        balance: { balance: 10000, amount: 50000, auth: 'verified', pattern: 'normal' },
        limit: { balance: 1000000000, amount: 500000000, auth: 'verified', pattern: 'normal' },
        auth: { balance: 1000000, amount: 50000, auth: 'unverified', pattern: 'normal' },
        suspicious: { balance: 1000000, amount: 50000, auth: 'verified', pattern: 'suspicious' },
        blacklist: { balance: 1000000, amount: 50000, auth: 'verified', pattern: 'blacklist' }
    },

    getAiScore: function(pattern) {
        switch(pattern) {
            case 'suspicious': return 0.75 + Math.random() * 0.2;
            case 'blacklist': return 0.3 + Math.random() * 0.2;
            default: return Math.random() * 0.4;
        }
    },

    verify: function(params) {
        const results = [];
        const { balance, amount, auth, pattern } = params;

        // Step 1: 잔액 확인
        const step1Pass = balance >= amount;
        results.push({
            step: 1,
            pass: step1Pass,
            msg: step1Pass ? 'PASS: 잔액 충분' : 'FAIL: 잔액 부족',
            data: { balance, amount }
        });
        if (!step1Pass) return { success: false, results, failAt: 1 };

        // Step 2: 신원 확인
        const step2Pass = auth === 'verified';
        results.push({
            step: 2,
            pass: step2Pass,
            msg: step2Pass ? 'PASS: 신원 확인됨' : 'FAIL: 미인증 사용자',
            data: { auth }
        });
        if (!step2Pass) return { success: false, results, failAt: 2 };

        // Step 3: 한도 확인
        const limit = 100000000;
        const step3Pass = amount <= limit;
        results.push({
            step: 3,
            pass: step3Pass,
            msg: step3Pass ? 'PASS: 한도 이내' : 'FAIL: 한도 초과',
            data: { amount, limit }
        });
        if (!step3Pass) return { success: false, results, failAt: 3 };

        // Step 4: 이상 탐지
        const aiScore = this.getAiScore(pattern);
        const step4Pass = aiScore < 0.7;
        results.push({
            step: 4,
            pass: step4Pass,
            msg: step4Pass ? 'PASS: 정상 패턴' : 'FAIL: 의심 거래 탐지',
            data: { aiScore }
        });
        if (!step4Pass) return { success: false, results, failAt: 4 };

        // Step 5: 규정 준수
        const step5Pass = pattern !== 'blacklist';
        results.push({
            step: 5,
            pass: step5Pass,
            msg: step5Pass ? 'PASS: 규정 준수' : 'FAIL: 제재 대상 거래',
            data: { aml: true, sanction: pattern === 'blacklist' }
        });
        if (!step5Pass) return { success: false, results, failAt: 5 };

        return { success: true, results };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const presetBtns = document.querySelectorAll('.preset-btn');

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function resetUI() {
        document.querySelectorAll('.pipeline-step').forEach(step => {
            step.className = 'pipeline-step';
            step.querySelector('.step-result').textContent = '-';
        });
        document.querySelectorAll('.pipeline-connector').forEach(c => {
            c.className = 'pipeline-connector';
        });
        document.getElementById('aiBar').style.width = '0';
        document.getElementById('aiBar').className = 'ai-bar';
        document.getElementById('finalResult').className = 'final-result';
        document.getElementById('finalIcon').textContent = '⏳';
        document.getElementById('finalText').textContent = '검증 대기 중';
        document.getElementById('finalTime').textContent = '-';
    }

    function applyPreset(preset) {
        const p = VerificationSimulator.presets[preset];
        document.getElementById('senderBalance').value = p.balance;
        document.getElementById('txAmount').value = p.amount;
        document.getElementById('senderAuth').value = p.auth;
        document.getElementById('txPattern').value = p.pattern;
    }

    function updateStepUI(stepNum, data) {
        if (stepNum === 1) {
            document.getElementById('v1Balance').textContent = data.balance.toLocaleString() + ' T';
            document.getElementById('v1Amount').textContent = data.amount.toLocaleString() + ' T';
        } else if (stepNum === 2) {
            document.getElementById('v2Auth').textContent = data.auth === 'verified' ? '인증됨 ✓' : '미인증 ✗';
        } else if (stepNum === 3) {
            document.getElementById('v3Amount').textContent = data.amount.toLocaleString() + ' T';
        } else if (stepNum === 4) {
            const score = data.aiScore;
            document.getElementById('v4Score').textContent = score.toFixed(3);
            const bar = document.getElementById('aiBar');
            bar.style.width = (score * 100) + '%';
            bar.className = 'ai-bar' + (score >= 0.7 ? ' danger' : score >= 0.5 ? ' warning' : '');
        } else if (stepNum === 5) {
            document.getElementById('v5Aml').textContent = 'AML: 통과';
            document.getElementById('v5Sanction').textContent = data.sanction ? '제재: 해당 ✗' : '제재: 해당없음 ✓';
        }
    }

    async function animateStep(stepNum, pass, msg, data, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                const step = document.querySelector('.pipeline-step[data-step="' + stepNum + '"]');
                const connector = document.getElementById('c' + (stepNum - 1));
                
                step.classList.remove('active');
                step.classList.add(pass ? 'pass' : 'fail');
                step.querySelector('.step-result').textContent = msg;
                
                if (connector) {
                    connector.classList.remove('active');
                    connector.classList.add('done');
                }
                
                updateStepUI(stepNum, data);
                log('Step ' + stepNum + ': ' + msg, pass ? 'success' : 'error');
                
                resolve();
            }, delay);
        });
    }

    async function activateStep(stepNum) {
        const step = document.querySelector('.pipeline-step[data-step="' + stepNum + '"]');
        const connector = document.getElementById('c' + (stepNum - 1));
        
        step.classList.add('active');
        if (connector) connector.classList.add('active');
        
        await new Promise(r => setTimeout(r, 300));
    }

    async function runSimulation() {
        resetUI();
        runBtn.disabled = true;
        runBtn.textContent = '검증 중...';
        runBtn.classList.add('running');

        const params = {
            balance: parseInt(document.getElementById('senderBalance').value) || 0,
            amount: parseInt(document.getElementById('txAmount').value) || 0,
            auth: document.getElementById('senderAuth').value,
            pattern: document.getElementById('txPattern').value
        };

        log('=== 5단계 검증 시작 ===');
        log('잔액: ' + params.balance.toLocaleString() + ' T, 송금액: ' + params.amount.toLocaleString() + ' T');

        const startTime = performance.now();
        const result = VerificationSimulator.verify(params);

        for (let i = 0; i < result.results.length; i++) {
            const r = result.results[i];
            await activateStep(r.step);
            await animateStep(r.step, r.pass, r.msg, r.data, 500);
        }

        const endTime = performance.now();
        const elapsed = (endTime - startTime).toFixed(2);

        // 최종 결과
        const finalResult = document.getElementById('finalResult');
        const finalIcon = document.getElementById('finalIcon');
        const finalText = document.getElementById('finalText');
        const finalTime = document.getElementById('finalTime');

        if (result.success) {
            finalResult.classList.add('success');
            finalIcon.textContent = '✅';
            finalText.textContent = '거래 승인';
            log('=== 모든 검증 통과: 거래 승인 ===', 'success');
        } else {
            finalResult.classList.add('fail');
            finalIcon.textContent = '❌';
            finalText.textContent = '거래 거부 (Step ' + result.failAt + ')';
            log('=== 검증 실패: 거래 거부 ===', 'error');
        }
        finalTime.textContent = '처리 시간: ' + elapsed + ' ms';

        runBtn.disabled = false;
        runBtn.textContent = '검증 시작';
        runBtn.classList.remove('running');
    }

    // 프리셋 버튼 이벤트
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            applyPreset(this.dataset.preset);
        });
    });

    runBtn.addEventListener('click', runSimulation);
});
