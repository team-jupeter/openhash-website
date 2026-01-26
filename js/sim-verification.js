/**
 * OpenHash 5-Step Verification Simulator
 * 하향식 검증 - API 연동 버전
 */
const VerificationSimulator = {
    presets: {
        success: { balance: 1000000, amount: 50000, auth: 'verified', pattern: 'normal', label: '✅ 정상 거래' },
        balance: { balance: 10000, amount: 50000, auth: 'verified', pattern: 'normal', label: '💰 잔액 부족' },
        limit: { balance: 1000000000, amount: 500000000, auth: 'verified', pattern: 'normal', label: '🚫 한도 초과' },
        auth: { balance: 1000000, amount: 50000, auth: 'unverified', pattern: 'normal', label: '🔒 미인증' },
        suspicious: { balance: 1000000, amount: 50000, auth: 'verified', pattern: 'suspicious', label: '⚠️ 의심 거래' },
        blacklist: { balance: 1000000, amount: 50000, auth: 'verified', pattern: 'blacklist', label: '🚨 제재 대상' }
    },

    // Backend API 검증 호출
    async verifyAPI(sender, receiver, amount) {
        try {
            return await OpenHashConfig.post(1, '/verify', { sender, receiver, amount });
        } catch (e) {
            return { error: e.message };
        }
    },

    getAiScore(pattern) {
        switch(pattern) {
            case 'suspicious': return 0.75 + Math.random() * 0.2;
            case 'blacklist': return 0.3 + Math.random() * 0.2;
            default: return Math.random() * 0.4;
        }
    },

    // 로컬 Mock 검증
    verify(params) {
        const results = [];
        const { balance, amount, auth, pattern } = params;

        // Step 1
        const step1Pass = balance >= amount;
        results.push({ step: 1, name: '잔액 확인', pass: step1Pass, msg: step1Pass ? '잔액 충분' : '잔액 부족' });
        if (!step1Pass) return { success: false, results, failAt: 1 };

        // Step 2
        const step2Pass = auth === 'verified';
        results.push({ step: 2, name: '신원 확인', pass: step2Pass, msg: step2Pass ? 'DID 인증 완료' : '미인증 사용자' });
        if (!step2Pass) return { success: false, results, failAt: 2 };

        // Step 3
        const step3Pass = amount <= 100000000;
        results.push({ step: 3, name: '한도 확인', pass: step3Pass, msg: step3Pass ? '한도 이내' : '한도 초과' });
        if (!step3Pass) return { success: false, results, failAt: 3 };

        // Step 4
        const aiScore = this.getAiScore(pattern);
        const step4Pass = aiScore < 0.7;
        results.push({ step: 4, name: 'AI 이상 탐지', pass: step4Pass, msg: (step4Pass ? '정상' : '의심') + ' (점수: ' + aiScore.toFixed(3) + ')', data: { aiScore } });
        if (!step4Pass) return { success: false, results, failAt: 4 };

        // Step 5
        const step5Pass = pattern !== 'blacklist';
        results.push({ step: 5, name: '규정 준수', pass: step5Pass, msg: step5Pass ? 'AML 통과' : '제재 대상' });
        if (!step5Pass) return { success: false, results, failAt: 5 };

        return { success: true, results };
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const presetSelect = document.getElementById('presetSelect');
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
    const connected = await OpenHashConfig.checkConnection();
    if (statusIcon) statusIcon.classList.add(connected ? 'online' : 'offline');
    if (statusText) statusText.textContent = connected ? 'L1 노드 연결됨' : '시뮬레이션 모드';
    log(connected ? '✅ 노드 연결 성공' : '⚡ 시뮬레이션 모드', connected ? 'success' : 'warning');

    function resetSteps() {
        for (let i = 1; i <= 5; i++) {
            const step = document.getElementById('step' + i);
            if (step) {
                step.classList.remove('active', 'pass', 'fail');
                const result = step.querySelector('.step-result');
                if (result) result.textContent = '-';
            }
        }
        const aiBar = document.getElementById('aiBar');
        if (aiBar) aiBar.style.width = '0%';
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
                        const result = step.querySelector('.step-result');
                        if (result) result.textContent = pass ? 'PASS' : 'FAIL';
                    }, 200);
                }
                resolve();
            }, delay);
        });
    }

    function showResultModal(success, failAt) {
        const existingModal = document.getElementById('resultModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'resultModal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content ${success ? 'success' : 'fail'}">
                <div class="modal-header">
                    <span class="modal-icon">${success ? '✅' : '❌'}</span>
                    <h3>${success ? '검증 통과' : '검증 실패'}</h3>
                </div>
                <div class="modal-body">
                    <div class="result-text">${success ? '5단계 검증을 모두 통과했습니다.' : 'Step ' + failAt + '에서 검증 실패'}</div>
                </div>
                <button class="modal-close" onclick="this.closest('.result-modal').remove()">확인</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    async function runSimulation() {
        runBtn.disabled = true;
        runBtn.textContent = '검증 중...';
        resetSteps();

        const preset = presetSelect?.value || 'success';
        const params = VerificationSimulator.presets[preset];

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🔍 5단계 검증 시작: ' + params.label, 'info');
        log('금액: ' + params.amount.toLocaleString() + ' T', 'info');

        let result;

        // Backend 모드
        if (OpenHashConfig.isBackend()) {
            log('📡 Backend API 호출 중...', 'info');
            const apiResult = await VerificationSimulator.verifyAPI('sender', 'receiver', params.amount);
            
            if (apiResult.error) {
                log('❌ API 오류: ' + apiResult.error, 'error');
                result = VerificationSimulator.verify(params);
            } else {
                result = apiResult;
                log('✅ Backend 응답 수신', 'success');
            }
        } else {
            // Mock-up 모드
            log('⚡ Mock-up 시뮬레이션', 'info');
            result = VerificationSimulator.verify(params);
        }

        // 애니메이션 표시
        for (let i = 0; i < result.results.length; i++) {
            const r = result.results[i];
            await animateStep(r.step, r.pass, r.pass ? 'PASS' : 'FAIL', 400);
            log((r.pass ? '✅' : '❌') + ' Step ' + r.step + ' ' + r.name + ': ' + r.msg, r.pass ? 'success' : 'error');
            
            if (r.step === 4 && r.data?.aiScore !== undefined) {
                const aiBar = document.getElementById('aiBar');
                if (aiBar) {
                    aiBar.style.width = (r.data.aiScore * 100) + '%';
                    aiBar.className = 'ai-bar-fill ' + (r.data.aiScore < 0.7 ? 'normal' : 'danger');
                }
            }
        }

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log(result.success ? '✅ 검증 완료: 승인' : '❌ 검증 실패: Step ' + result.failAt, result.success ? 'success' : 'error');

        await new Promise(r => setTimeout(r, 300));
        showResultModal(result.success, result.failAt);

        runBtn.disabled = false;
        runBtn.textContent = '검증 실행';
    }

    if (runBtn) runBtn.addEventListener('click', runSimulation);
});
