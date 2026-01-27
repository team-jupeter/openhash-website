const LayerSelectSimulator = {
    probNormal: [50, 80, 92, 98, 100],  // L1, L2, L3, L4, L5 누적
    probHigh: [15, 35, 65, 90, 100],
    layerNames: ['L1 읍면동', 'L2 시군구', 'L3 광역시도', 'L4 국가', 'L5 글로벌'],

    // 간단한 SHA-256 시뮬레이션 (실제 구현은 crypto API 사용)
    simpleHash: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        // 64자 hex-like 문자열 생성
        const hex = Math.abs(hash).toString(16).padStart(8, '0');
        return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
    },

    selectLayer: function(document, importance, timestamp) {
        const ts = timestamp || Date.now().toString();
        
        // Step 1: 문서 해싱
        const docHash = this.simpleHash(document);
        
        // Step 2: 타임스탬프 연결
        const combined = docHash + ts;
        
        // Step 3: 1차 재해싱
        const hash1 = this.simpleHash(combined);
        
        // Step 4: 2차 재해싱
        const hash2 = this.simpleHash(hash1);
        
        // Step 5: 0-99 범위 변환
        const value = parseInt(hash2.slice(-4), 16) % 100;
        
        // Step 6: 확률 분포에 따른 계층 선택
        const prob = importance === 'high' ? this.probHigh : this.probNormal;
        let layer = 0;
        for (let i = 0; i < prob.length; i++) {
            if (value < prob[i]) {
                layer = i;
                break;
            }
        }

        return {
            docHash,
            timestamp: ts,
            hash1,
            hash2,
            value,
            layer,
            layerName: this.layerNames[layer]
        };
    },

    updateProbDisplay: function(importance) {
        const probs = importance === 'high' 
            ? [15, 20, 30, 25, 10] 
            : [50, 30, 12, 6, 2];
        
        document.getElementById('probL1').textContent = probs[0] + '%';
        document.getElementById('probL2').textContent = probs[1] + '%';
        document.getElementById('probL3').textContent = probs[2] + '%';
        document.getElementById('probL4').textContent = probs[3] + '%';
        document.getElementById('probL5').textContent = probs[4] + '%';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const runBtn = document.getElementById('runSimBtn');
    const logArea = document.getElementById('logArea');
    const importanceSelect = document.getElementById('importance');

    function log(msg, type = 'info') {
        const line = document.createElement('div');
        line.className = 'log-line ' + type;
        line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
        logArea.appendChild(line);
        logArea.scrollTop = logArea.scrollHeight;
    }

    function resetChart() {
        for (let i = 1; i <= 5; i++) {
            document.getElementById('barL' + i).style.width = '0%';
            document.getElementById('countL' + i).textContent = '0';
        }
    }

    function updateChart(counts, total) {
        for (let i = 1; i <= 5; i++) {
            const pct = total > 0 ? (counts[i-1] / total * 100) : 0;
            document.getElementById('barL' + i).style.width = pct + '%';
            document.getElementById('countL' + i).textContent = counts[i-1] + ' (' + pct.toFixed(1) + '%)';
        }
    }

    function displayHashProcess(result) {
        document.getElementById('step1Hash').textContent = result.docHash;
        document.getElementById('step2Timestamp').textContent = result.timestamp;
        document.getElementById('step3Hash').textContent = result.hash1;
        document.getElementById('step4Hash').textContent = result.hash2;
        document.getElementById('step5Value').textContent = result.value + ' (0-99 범위)';
        
        const layerEl = document.getElementById('selectedLayer');
        layerEl.textContent = result.layerName;
        layerEl.className = 'selected-layer';
    }

    async function runSimulation() {
        runBtn.disabled = true;
        runBtn.textContent = '실행 중...';
        runBtn.classList.add('running');

        const docContent = document.getElementById('docContent').value || 'test';
        const importance = document.getElementById('importance').value;
        const iterations = parseInt(document.getElementById('iterations').value);

        log('시뮬레이션 시작: ' + iterations + '회 반복, 중요도=' + importance);
        resetChart();

        const counts = [0, 0, 0, 0, 0]; // L1~L5
        let lastResult = null;

        for (let i = 0; i < iterations; i++) {
            // 각 반복마다 다른 타임스탬프 사용
            const ts = (Date.now() + i).toString() + Math.random().toString(36);
            const result = LayerSelectSimulator.selectLayer(docContent, importance, ts);
            counts[result.layer]++;
            lastResult = result;

            // 진행률 업데이트 (10% 단위)
            if (iterations > 1 && (i + 1) % Math.ceil(iterations / 10) === 0) {
                updateChart(counts, i + 1);
                await new Promise(r => setTimeout(r, 50));
            }
        }

        // 마지막 결과 표시
        displayHashProcess(lastResult);
        updateChart(counts, iterations);

        // 통계 로그
        log('=== 결과 통계 ===', 'success');
        for (let i = 0; i < 5; i++) {
            const pct = (counts[i] / iterations * 100).toFixed(1);
            log('L' + (i+1) + ': ' + counts[i] + '회 (' + pct + '%)', 
                counts[i] > 0 ? 'success' : 'info');
        }
        log('시뮬레이션 완료', 'success');

        runBtn.disabled = false;
        runBtn.textContent = '시뮬레이션 실행';
        runBtn.classList.remove('running');
    }

    // 중요도 변경 시 확률 표시 업데이트
    importanceSelect.addEventListener('change', function() {
        LayerSelectSimulator.updateProbDisplay(this.value);
    });

    runBtn.addEventListener('click', runSimulation);
});
