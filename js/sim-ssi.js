const SSISimulator = {
    credential: null,

    simpleHash: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const hex = Math.abs(hash).toString(16).padStart(8, '0');
        return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
    },

    generateSignature: function(hash, issuer) {
        return 'sig_' + issuer + '_' + this.simpleHash(hash + issuer).substring(0, 32);
    },

    generateCredentialId: function() {
        return 'cred_' + Math.random().toString(36).substr(2, 12);
    },

    register: function(name, ssn, issuer, layer) {
        const original = JSON.stringify({ name, ssn, issuer, createdAt: Date.now() });
        const hash = this.simpleHash(original);
        const signature = this.generateSignature(hash, issuer);
        const timestamp = new Date().toISOString();
        const nodeId = 'node_' + layer + '_' + Math.floor(Math.random() * 10);
        const credentialId = this.generateCredentialId();

        this.credential = {
            original,
            hash,
            signature,
            issuer,
            layer,
            nodeId,
            timestamp,
            credentialId,
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };

        return this.credential;
    },

    verify: function(tamperHash, invalidSig, expiredTs) {
        if (!this.credential) return { success: false, reason: 'NO_CREDENTIAL' };

        const results = {
            original: true,
            signature: true,
            hash: true,
            location: true,
            timestamp: true
        };

        // 1. 원본 검증
        results.original = !!this.credential.original;

        // 2. 서명 검증
        if (invalidSig) {
            results.signature = false;
        } else {
            const expectedSig = this.generateSignature(this.credential.hash, this.credential.issuer);
            results.signature = this.credential.signature === expectedSig;
        }

        // 3. 해시 검증
        if (tamperHash) {
            results.hash = false;
        } else {
            const computedHash = this.simpleHash(this.credential.original);
            results.hash = computedHash === this.credential.hash;
        }

        // 4. 위치 검증 (항상 통과)
        results.location = true;

        // 5. 타임스탬프 검증
        if (expiredTs) {
            results.timestamp = false;
        } else {
            results.timestamp = new Date(this.credential.validUntil) > new Date();
        }

        const success = Object.values(results).every(v => v);
        return { success, results };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.getElementById('registerBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const logArea = document.getElementById('logArea');

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function resetSteps() {
        document.querySelectorAll('.ssi-step').forEach(step => {
            step.className = 'ssi-step';
            step.querySelector('.ssi-step-status').textContent = '⏳';
        });
        document.querySelectorAll('.element-item').forEach(el => {
            el.className = 'element-item';
            el.querySelector('.element-status').textContent = '-';
        });
        document.getElementById('verifyResult').className = 'verify-result';
        document.getElementById('verifyIcon').textContent = '🔒';
        document.getElementById('verifyText').textContent = '신원 등록을 먼저 진행하세요';
    }

    async function animateStep(stepName, status, value, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                const step = document.querySelector('.ssi-step[data-step="' + stepName + '"]');
                step.classList.add(status === 'done' ? 'done' : 'active');
                step.querySelector('.ssi-step-status').textContent = status === 'done' ? '✅' : '🔄';
                if (value) {
                    step.querySelector('code').textContent = value;
                }
                resolve();
            }, delay);
        });
    }

    async function register() {
        resetSteps();
        registerBtn.disabled = true;
        verifyBtn.disabled = true;

        const name = document.getElementById('userName').value || '홍길동';
        const ssn = document.getElementById('userSSN').value || '900101-1234567';
        const issuer = document.getElementById('issuer').value;
        const layer = document.getElementById('storageLayer').value;

        log('=== SSI 신원 등록 시작 ===');
        log('이름: ' + name + ', 발행기관: ' + issuer);

        // Step 1: 해싱
        await animateStep('hash', 'active', '처리 중...', 300);
        const cred = SSISimulator.register(name, ssn, issuer, layer);
        await animateStep('hash', 'done', cred.hash, 500);
        log('해시 생성 완료: ' + cred.hash.substring(0, 20) + '...', 'success');

        // Step 2: 저장
        await animateStep('store', 'active', '처리 중...', 300);
        await animateStep('store', 'done', layer + ' / ' + cred.nodeId, 500);
        log('계층 저장 완료: ' + layer + ' / ' + cred.nodeId, 'success');

        // Step 3: 서명
        await animateStep('sign', 'active', '처리 중...', 300);
        await animateStep('sign', 'done', cred.signature, 500);
        log('발행자 서명 완료: ' + cred.signature.substring(0, 20) + '...', 'success');

        // Step 4: 완료
        await animateStep('complete', 'active', '처리 중...', 300);
        await animateStep('complete', 'done', cred.credentialId, 500);
        log('크리덴셜 발급 완료: ' + cred.credentialId, 'success');

        document.getElementById('verifyText').textContent = '등록 완료 - 검증 가능';
        document.getElementById('verifyIcon').textContent = '🔓';

        log('=== SSI 등록 완료 ===', 'success');

        registerBtn.disabled = false;
        verifyBtn.disabled = false;
    }

    async function verify() {
        verifyBtn.disabled = true;
        
        const tamperHash = document.getElementById('tamperHash').checked;
        const invalidSig = document.getElementById('invalidSig').checked;
        const expiredTs = document.getElementById('expiredTs').checked;

        log('=== SSI 신원 검증 시작 ===');
        if (tamperHash) log('⚠️ 해시 변조 시뮬레이션 활성화', 'warn');
        if (invalidSig) log('⚠️ 서명 검증 실패 시뮬레이션 활성화', 'warn');
        if (expiredTs) log('⚠️ 유효기간 만료 시뮬레이션 활성화', 'warn');

        const result = SSISimulator.verify(tamperHash, invalidSig, expiredTs);

        const elements = [
            { id: 'e1Status', key: 'original', name: '신분증 원본' },
            { id: 'e2Status', key: 'signature', name: '발행자 서명' },
            { id: 'e3Status', key: 'hash', name: '해시값' },
            { id: 'e4Status', key: 'location', name: '계층/노드' },
            { id: 'e5Status', key: 'timestamp', name: '저장 시각' }
        ];

        for (let i = 0; i < elements.length; i++) {
            await new Promise(r => setTimeout(r, 400));
            const el = elements[i];
            const pass = result.results[el.key];
            const item = document.querySelector('.element-item[data-element="' + (i + 1) + '"]');
            item.classList.add(pass ? 'pass' : 'fail');
            document.getElementById(el.id).textContent = pass ? '✓' : '✗';
            log('  ' + el.name + ': ' + (pass ? 'PASS' : 'FAIL'), pass ? 'success' : 'error');
        }

        await new Promise(r => setTimeout(r, 300));

        const verifyResult = document.getElementById('verifyResult');
        const verifyIcon = document.getElementById('verifyIcon');
        const verifyText = document.getElementById('verifyText');

        if (result.success) {
            verifyResult.classList.add('success');
            verifyIcon.textContent = '✅';
            verifyText.textContent = '신원 확인됨';
            log('=== 신원 검증 성공 ===', 'success');
        } else {
            verifyResult.classList.add('fail');
            verifyIcon.textContent = '❌';
            verifyText.textContent = '신원 검증 실패';
            log('=== 신원 검증 실패 ===', 'error');
        }

        verifyBtn.disabled = false;
    }

    registerBtn.addEventListener('click', register);
    verifyBtn.addEventListener('click', verify);
});
