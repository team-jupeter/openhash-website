const OpenHashSimulator = {
    regions: {
        'KR-JEJU-SEOGWIPO-JUNGMUN': { name: '제주 서귀포시 중문동', hierarchy: ['GLOBAL','KR','KR-JEJU','KR-JEJU-SEOGWIPO','KR-JEJU-SEOGWIPO-JUNGMUN'] },
        'KR-JEJU-SEOGWIPO-DAEJEONG': { name: '제주 서귀포시 대정읍', hierarchy: ['GLOBAL','KR','KR-JEJU','KR-JEJU-SEOGWIPO','KR-JEJU-SEOGWIPO-DAEJEONG'] },
        'KR-JEJU-JEJU-NOHYEONG': { name: '제주 제주시 노형동', hierarchy: ['GLOBAL','KR','KR-JEJU','KR-JEJU-JEJU','KR-JEJU-JEJU-NOHYEONG'] },
        'KR-SEOUL-GANGNAM-YEOKSAM': { name: '서울 강남구 역삼동', hierarchy: ['GLOBAL','KR','KR-SEOUL','KR-SEOUL-GANGNAM','KR-SEOUL-GANGNAM-YEOKSAM'] },
        'KR-BUSAN-HAEUNDAE-U': { name: '부산 해운대구 우동', hierarchy: ['GLOBAL','KR','KR-BUSAN','KR-BUSAN-HAEUNDAE','KR-BUSAN-HAEUNDAE-U'] },
        'US-CA-LA-DOWNTOWN': { name: '미국 LA 다운타운', hierarchy: ['GLOBAL','US','US-CA','US-CA-LA','US-CA-LA-DOWNTOWN'] },
        'JP-TOKYO-SHIBUYA-HARAJUKU': { name: '일본 도쿄 시부야', hierarchy: ['GLOBAL','JP','JP-TOKYO','JP-TOKYO-SHIBUYA','JP-TOKYO-SHIBUYA-HARAJUKU'] }
    },
    layerNames: ['읍면동', '시군구', '광역시도', '국가', 'GLOBAL'],

    findCommonLayer: function(sender, receiver) {
        var sH = this.regions[sender].hierarchy;
        var rH = this.regions[receiver].hierarchy;
        for (var i = 4; i >= 0; i--) {
            if (sH[i] === rH[i]) return { level: i, name: this.layerNames[i], code: sH[i] };
        }
        return { level: 4, name: 'GLOBAL', code: 'GLOBAL' };
    },

    runSimulation: function(sender, receiver, amount, senderBal) {
        var result = { success: false, steps: [], common: null, time: 0 };
        var start = performance.now();
        
        // Step 1: 잔액확인
        if (senderBal < amount) {
            result.steps.push({ name: '잔액확인', status: 'fail', msg: '잔액 부족' });
            return result;
        }
        result.steps.push({ name: '잔액확인', status: 'pass', msg: '잔액 충분' });

        // Step 2: 신원확인
        result.steps.push({ name: '신원확인', status: 'pass', msg: '신원 확인됨' });

        // Step 3: 한도확인
        if (amount > 100000000) {
            result.steps.push({ name: '한도확인', status: 'fail', msg: '한도 초과' });
            return result;
        }
        result.steps.push({ name: '한도확인', status: 'pass', msg: '한도 이내' });

        // Step 4: 이상탐지
        var aiScore = Math.random() * 0.3;
        result.steps.push({ name: '이상탐지', status: 'pass', msg: 'AI 점수: ' + aiScore.toFixed(3) });

        // Step 5: 규정준수
        result.steps.push({ name: '규정준수', status: 'pass', msg: 'AML/CFT 통과' });

        // 공통계층 탐색
        result.common = this.findCommonLayer(sender, receiver);
        result.time = (performance.now() - start).toFixed(2);
        result.success = true;
        return result;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    var simBtn = document.getElementById('simBtn');
    if (!simBtn) return;

    simBtn.addEventListener('click', function() {
        var sender = document.getElementById('senderRegion').value;
        var receiver = document.getElementById('receiverRegion').value;
        var amount = parseInt(document.getElementById('txAmount').value) || 0;
        var senderBal = 1000000;

        var result = OpenHashSimulator.runSimulation(sender, receiver, amount, senderBal);
        displayResult(result);
    });

    function displayResult(result) {
        var stepsEl = document.getElementById('simSteps');
        var resultEl = document.getElementById('simResult');
        if (!stepsEl || !resultEl) return;

        stepsEl.innerHTML = '';
        var delay = 0;
        result.steps.forEach(function(step) {
            delay += 300;
            setTimeout(function() {
                var div = document.createElement('div');
                div.className = 'step ' + step.status;
                div.innerHTML = '<span class="step-name">' + step.name + '</span><span class="step-msg">' + step.msg + '</span>';
                stepsEl.appendChild(div);
            }, delay);
        });

        setTimeout(function() {
            if (result.success) {
                resultEl.className = 'sim-result success';
                resultEl.innerHTML = '<strong>거래 승인</strong><br>공통계층: ' + result.common.name + ' (' + result.common.code + ')<br>처리시간: ' + result.time + 'ms';
            } else {
                resultEl.className = 'sim-result error';
                resultEl.innerHTML = '<strong>거래 거부</strong>';
            }
        }, delay + 300);
    }
});
