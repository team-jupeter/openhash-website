/**
 * OpenHash SSI (Self-Sovereign Identity) Simulator
 * 자기주권신원 인증 - API 연동 버전
 */
const SSISimulator = {
    credential: null,

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

    generateDID() {
        return 'did:openhash:' + Math.random().toString(36).substr(2, 16);
    },

    generateSignature(hash, issuer) {
        return 'sig_' + this.simpleHash(hash + issuer + Date.now()).substring(0, 40);
    },

    generateCredentialId() {
        return 'vc_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
    },

    // Backend API: DID 등록
    async registerAPI(name, birthDate, issuer, credType) {
        try {
            return await OpenHashConfig.post(1, '/ssi/register', { name, birthDate, issuer, credType });
        } catch (e) {
            return { error: e.message };
        }
    },

    // Backend API: 자격 증명 검증
    async verifyAPI(did, options) {
        try {
            return await OpenHashConfig.post(1, '/ssi/verify', { did, ...options });
        } catch (e) {
            return { error: e.message };
        }
    },

    // Mock: DID 등록
    register(name, birthDate, issuer, credType) {
        const did = this.generateDID();
        const timestamp = new Date().toISOString();
        
        const credentialData = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential', credType],
            issuer: issuer,
            issuanceDate: timestamp,
            credentialSubject: { id: did, name, birthDate }
        };

        const dataString = JSON.stringify(credentialData);
        const hash = this.simpleHash(dataString);
        const signature = this.generateSignature(hash, issuer);

        this.credential = {
            id: this.generateCredentialId(),
            did, data: credentialData, hash, signature,
            issuer, credType, timestamp,
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        };

        return this.credential;
    },

    // Mock: 자격 증명 검증
    verify(options = {}) {
        if (!this.credential) {
            return { success: false, reason: 'NO_CREDENTIAL', results: [] };
        }

        const { tamperData, invalidSig, expired } = options;
        const results = [];

        // Step 1: DID 확인
        const didValid = this.credential.did && this.credential.did.startsWith('did:openhash:');
        results.push({ step: 1, name: 'DID 확인', pass: didValid, msg: didValid ? 'DID 형식 유효' : 'DID 형식 오류' });

        // Step 2: 해시 무결성
        let hashValid = !tamperData;
        results.push({ step: 2, name: '해시 무결성', pass: hashValid, msg: hashValid ? '데이터 무결성 확인' : '데이터 변조 감지' });

        // Step 3: 서명 검증
        const sigValid = !invalidSig;
        results.push({ step: 3, name: '서명 검증', pass: sigValid, msg: sigValid ? '발급자 서명 유효' : '서명 불일치' });

        // Step 4: 유효기간
        let timeValid = !expired;
        results.push({ step: 4, name: '유효기간', pass: timeValid, msg: timeValid ? '유효기간 내' : '자격 증명 만료' });

        // Step 5: 폐기 확인
        const notRevoked = this.credential.status === 'active';
        results.push({ step: 5, name: '폐기 확인', pass: notRevoked, msg: notRevoked ? '활성 상태' : '폐기된 자격 증명' });

        const success = results.every(r => r.pass);
        return { success, results };
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    const registerBtn = document.getElementById('registerBtn');
    const verifyBtn = document.getElementById('verifyBtn');
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

    function showCredential(cred) {
        const credInfo = document.getElementById('credentialInfo');
        if (credInfo) {
            credInfo.innerHTML = `
                <div class="cred-item"><span>ID:</span><strong>${cred.id}</strong></div>
                <div class="cred-item"><span>DID:</span><strong>${cred.did.substring(0, 30)}...</strong></div>
                <div class="cred-item"><span>발급자:</span><strong>${cred.issuer}</strong></div>
                <div class="cred-item"><span>유형:</span><strong>${cred.credType}</strong></div>
                <div class="cred-item"><span>유효기간:</span><strong>${cred.validUntil.split('T')[0]}</strong></div>
            `;
            credInfo.style.display = 'block';
        }
    }

    function showResultModal(success, action) {
        const existingModal = document.getElementById('resultModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'resultModal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="modal-content ${success ? 'success' : 'fail'}">
                <div class="modal-header">
                    <span class="modal-icon">${success ? '✅' : '❌'}</span>
                    <h3>${action === 'register' ? (success ? 'DID 등록 완료' : '등록 실패') : (success ? '검증 성공' : '검증 실패')}</h3>
                </div>
                <div class="modal-body">
                    <div class="result-text">${success ? (action === 'register' ? '자기주권신원이 블록체인에 등록되었습니다.' : '모든 검증 단계를 통과했습니다.') : '검증 과정에서 오류가 발생했습니다.'}</div>
                </div>
                <button class="modal-close" onclick="this.closest('.result-modal').remove()">확인</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // DID 등록
    async function registerDID() {
        registerBtn.disabled = true;
        registerBtn.textContent = '등록 중...';

        const name = document.getElementById('userName')?.value || '홍길동';
        const birthDate = document.getElementById('userBirth')?.value || '1990-01-01';
        const issuer = document.getElementById('issuer')?.value || '행정안전부';
        const credType = document.getElementById('credType')?.value || 'IdentityCredential';

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🆔 DID 등록 시작', 'info');
        log('이름: ' + name + ', 발급자: ' + issuer, 'info');

        let credential;

        // Backend 모드
        if (OpenHashConfig.isBackend()) {
            log('📡 Backend API 호출 중...', 'info');
            const apiResult = await SSISimulator.registerAPI(name, birthDate, issuer, credType);
            
            if (apiResult.error) {
                log('❌ API 오류: ' + apiResult.error, 'error');
                credential = SSISimulator.register(name, birthDate, issuer, credType);
            } else if (apiResult.credential) {
                credential = apiResult.credential;
                SSISimulator.credential = credential;
                log('✅ Backend 등록 완료', 'success');
            }
        } else {
            // Mock-up 모드
            log('⚡ Mock-up 시뮬레이션', 'info');
            await new Promise(r => setTimeout(r, 500));
            credential = SSISimulator.register(name, birthDate, issuer, credType);
        }

        log('✅ DID 생성: ' + credential.did.substring(0, 35) + '...', 'success');
        log('📄 자격 증명 ID: ' + credential.id, 'success');
        log('🔐 해시: ' + credential.hash.substring(0, 20) + '...', 'info');
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

        showCredential(credential);
        showResultModal(true, 'register');

        if (verifyBtn) verifyBtn.disabled = false;
        registerBtn.disabled = false;
        registerBtn.textContent = 'DID 등록';
    }

    // 자격 증명 검증
    async function verifyCredential() {
        verifyBtn.disabled = true;
        verifyBtn.textContent = '검증 중...';
        resetSteps();

        const tamperData = document.getElementById('tamperData')?.checked || false;
        const invalidSig = document.getElementById('invalidSig')?.checked || false;
        const expired = document.getElementById('expired')?.checked || false;

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log('🔍 자격 증명 검증 시작', 'info');

        let result;

        // Backend 모드
        if (OpenHashConfig.isBackend() && SSISimulator.credential?.did) {
            log('📡 Backend API 호출 중...', 'info');
            const apiResult = await SSISimulator.verifyAPI(SSISimulator.credential.did, { tamperData, invalidSig, expired });
            
            if (apiResult.error || apiResult.reason === 'NO_CREDENTIAL') {
                log('⚠️ Backend 검증 실패, Mock 사용', 'warning');
                result = SSISimulator.verify({ tamperData, invalidSig, expired });
            } else {
                result = apiResult;
                log('✅ Backend 응답 수신', 'success');
            }
        } else {
            // Mock-up 모드
            log('⚡ Mock-up 시뮬레이션', 'info');
            result = SSISimulator.verify({ tamperData, invalidSig, expired });
        }

        if (result.reason === 'NO_CREDENTIAL') {
            log('❌ 등록된 자격 증명이 없습니다', 'error');
            verifyBtn.disabled = false;
            verifyBtn.textContent = '검증 실행';
            return;
        }

        for (const r of result.results) {
            await animateStep(r.step, r.pass, r.msg, 400);
            log((r.pass ? '✅' : '❌') + ' Step ' + r.step + ' ' + r.name + ': ' + r.msg, r.pass ? 'success' : 'error');
        }

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
        log(result.success ? '✅ 검증 완료: 유효한 자격 증명' : '❌ 검증 실패', result.success ? 'success' : 'error');

        await new Promise(r => setTimeout(r, 300));
        showResultModal(result.success, 'verify');

        verifyBtn.disabled = false;
        verifyBtn.textContent = '검증 실행';
    }

    if (registerBtn) registerBtn.addEventListener('click', registerDID);
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.addEventListener('click', verifyCredential);
    }
});
