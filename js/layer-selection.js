/**
 * Layer Selection - 확률적 계층 선택 시뮬레이션
 * OpenHash 메인 페이지용
 */

document.addEventListener('DOMContentLoaded', function() {
// Scenario Data
        const scenarios = {
            'same-dong': {
                label: '같은 읍면동 거래',
                mapId: 'map-dong',
                mapTitle: '제주시 한림읍',
                mapScale: '읍면동 수준',
                // 한림읍 내 리(里)들 - 같은 읍면동이므로 L1
                locations: [
                    { name: '한림리', x: 280, y: 90, region: 'dong-hanrim' },
                    { name: '협재리', x: 385, y: 70, region: 'dong-hyeopjae' },
                    { name: '금악리', x: 475, y: 95, region: 'dong-geumak' },
                    { name: '귀덕리', x: 275, y: 175, region: 'dong-gwideok' },
                    { name: '동명리', x: 370, y: 160, region: 'dong-dongmyeong' },
                    { name: '수원리', x: 470, y: 170, region: 'dong-suwo' },
                    { name: '옥포리', x: 355, y: 255, region: 'dong-okupo' },
                    { name: '명월리', x: 445, y: 260, region: 'dong-myeongwol' },
                    { name: '금능리', x: 425, y: 340, region: 'dong-geumneung' }
                ],
                minLayer: 1,
                minLayerText: 'L1 (읍면동)',
                probs: [70, 20, 8, 2, 0],
                nodes: ['한림읍 노드', '제주시 노드', '제주도 노드', '대한민국 노드', '-']
            },
            'same-sigungu': {
                label: '같은 시군구 거래',
                mapId: 'map-sigungu',
                mapTitle: '제주시',
                mapScale: '시군구 수준',
                // 제주시 내 읍면동들 - 같은 시군구이므로 L2
                locations: [
                    { name: '한림읍', x: 225, y: 130, region: 'si-hanrim' },
                    { name: '애월읍', x: 305, y: 115, region: 'si-aewol' },
                    { name: '제주시내', x: 385, y: 120, region: 'si-jeju' },
                    { name: '조천읍', x: 460, y: 135, region: 'si-jocheon' },
                    { name: '구좌읍', x: 470, y: 230, region: 'si-gujwa' },
                    { name: '한경면', x: 205, y: 210, region: 'si-hallim2' }
                ],
                minLayer: 2,
                minLayerText: 'L2 (시군구)',
                probs: [0, 77, 19, 4, 0],
                nodes: ['-', '제주시 노드', '제주도 노드', '대한민국 노드', '-']
            },
            'same-sido': {
                label: '같은 광역시도 거래',
                mapId: 'map-sido',
                mapTitle: '제주특별자치도',
                mapScale: '광역시도 수준',
                // 제주도 내 시군 - 같은 광역시도이므로 L3
                locations: [
                    { name: '제주시', x: 360, y: 160, region: 'sido-jejusi' },
                    { name: '서귀포시', x: 360, y: 280, region: 'sido-seogwipo' },
                    { name: '우도', x: 520, y: 160, region: 'sido-udo' }
                ],
                minLayer: 3,
                minLayerText: 'L3 (광역시도)',
                probs: [0, 0, 80, 20, 0],
                nodes: ['-', '-', '제주도 노드', '대한민국 노드', '-']
            },
            'same-country': {
                label: '같은 국가 거래',
                mapId: 'map-korea',
                mapTitle: '대한민국',
                mapScale: '국가 수준',
                // 대한민국 내 광역시도 - 같은 국가이므로 L4
                locations: [
                    { name: '서울', x: 338, y: 105, region: 'korea-seoul' },
                    { name: '부산', x: 405, y: 330, region: 'korea-busan' },
                    { name: '제주', x: 260, y: 395, region: 'korea-jeju' },
                    { name: '강원', x: 410, y: 100, region: 'korea-gangwon' },
                    { name: '전남', x: 225, y: 280, region: 'korea-jeonnam' },
                    { name: '경북', x: 390, y: 220, region: 'korea-gyeongbuk' }
                ],
                minLayer: 4,
                minLayerText: 'L4 (국가)',
                probs: [0, 0, 0, 100, 0],
                nodes: ['-', '-', '-', '대한민국 노드', '-']
            },
            'diff-country': {
                label: '다른 국가 거래',
                mapId: 'map-asia',
                mapTitle: '동아시아',
                mapScale: '글로벌 수준',
                // 동아시아 국가들 - 다른 국가이므로 L5
                locations: [
                    { name: '서울', x: 390, y: 180, region: 'asia-korea' },
                    { name: '도쿄', x: 480, y: 140, region: 'asia-japan' },
                    { name: '베이징', x: 260, y: 100, region: 'asia-china' },
                    { name: '상하이', x: 300, y: 180, region: 'asia-china' }
                ],
                minLayer: 5,
                minLayerText: 'L5 (글로벌)',
                probs: [0, 0, 0, 0, 100],
                nodes: ['-', '-', '-', '-', '글로벌 노드']
            }
        };

        let currentScenario = 'same-dong';
        let isPlaying = false;

        // DOM Elements
        const mapContainer = document.getElementById('map-container');
        const userA = document.getElementById('user-a');
        const userB = document.getElementById('user-b');
        const connectionLine = document.getElementById('connection-line');
        const hashFlow = document.getElementById('hash-flow');
        const mapTitle = document.getElementById('map-title');
        const mapScale = document.getElementById('map-scale');
        const minLayerEl = document.getElementById('min-layer');
        const txHashEl = document.getElementById('tx-hash');
        const resultLayerEl = document.getElementById('result-layer');
        const resultNodeEl = document.getElementById('result-node');
        const resultNoteEl = document.getElementById('result-note');
        const playBtn = document.getElementById('play-btn');
        const layerProbs = document.getElementById('layer-probs');
        const scenarioBtns = document.querySelectorAll('.scenario-btn');
        const stepDots = document.querySelectorAll('.step-dot');

        // Initialize
        function init() {
            updateScenario(currentScenario);
        }

        // Update Scenario
        function updateScenario(scenarioId, randomize = true) {
            currentScenario = scenarioId;
            const s = scenarios[scenarioId];

            // Switch map
            document.querySelectorAll('.map-svg').forEach(m => m.classList.remove('active'));
            document.getElementById(s.mapId).classList.add('active');

            // Update header
            mapTitle.textContent = s.mapTitle;
            mapScale.textContent = s.mapScale;
            minLayerEl.textContent = s.minLayerText;

            // 랜덤하게 두 위치 선택 (A와 B는 다른 위치)
            let locA, locB;
            if (randomize && s.locations.length >= 2) {
                const shuffled = [...s.locations].sort(() => Math.random() - 0.5);
                locA = shuffled[0];
                locB = shuffled[1];
            } else {
                locA = s.locations[0];
                locB = s.locations[Math.min(1, s.locations.length - 1)];
            }

            // Update user positions
            userA.style.left = locA.x + 'px';
            userA.style.top = locA.y + 'px';
            userA.querySelector('.marker-label').textContent = 'A: ' + locA.name;

            userB.style.left = locB.x + 'px';
            userB.style.top = locB.y + 'px';
            userB.querySelector('.marker-label').textContent = 'B: ' + locB.name;

            // 현재 선택된 위치 저장
            s.currentA = locA;
            s.currentB = locB;

            // Highlight active regions
            document.querySelectorAll('.map-svg path, .map-svg ellipse').forEach(p => p.classList.remove('region-active'));
            [locA.region, locB.region].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('region-active');
            });

            // Update probability bars
            const layerProbEls = layerProbs.querySelectorAll('.layer-prob');
            layerProbEls.forEach((el, i) => {
                const prob = s.probs[i];
                const bar = el.querySelector('.prob-bar');
                const text = el.querySelector('.prob-text');
                
                bar.style.width = (prob * 0.9) + '%'; // Scale for visual
                text.textContent = prob > 0 ? prob + '%' : '-';
                
                el.classList.toggle('disabled', prob === 0);
                el.classList.remove('selected');
            });

            // Reset UI
            txHashEl.textContent = '-';
            resultLayerEl.textContent = '-';
            resultLayerEl.className = 'result-layer';
            resultNodeEl.textContent = '대기 중...';
            resultNoteEl.textContent = '시뮬레이션을 실행하세요';
            connectionLine.classList.remove('active');
            hashFlow.classList.remove('active');
            resetSteps();

            // Update buttons
            scenarioBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.scenario === scenarioId);
            });
        }

        // Generate fake hash
        function generateHash() {
            const chars = '0123456789abcdef';
            let hash = '';
            for (let i = 0; i < 12; i++) {
                hash += chars[Math.floor(Math.random() * chars.length)];
            }
            return hash + '...';
        }

        // Weighted random selection
        function selectLayer(probs) {
            const total = probs.reduce((a, b) => a + b, 0);
            let rand = Math.random() * total;
            for (let i = 0; i < probs.length; i++) {
                if (rand < probs[i]) return i + 1;
                rand -= probs[i];
            }
            return probs.length;
        }

        // Step indicator
        function setStep(step) {
            stepDots.forEach((dot, i) => {
                dot.classList.remove('active', 'done');
                if (i + 1 < step) dot.classList.add('done');
                if (i + 1 === step) dot.classList.add('active');
            });
        }

        function resetSteps() {
            stepDots.forEach(dot => dot.classList.remove('active', 'done'));
        }

        // Draw connection
        function drawConnection() {
            const rect = mapContainer.getBoundingClientRect();
            const ax = parseFloat(userA.style.left);
            const ay = parseFloat(userA.style.top);
            const bx = parseFloat(userB.style.left);
            const by = parseFloat(userB.style.top);

            const length = Math.sqrt((bx-ax)**2 + (by-ay)**2);
            const angle = Math.atan2(by-ay, bx-ax) * 180 / Math.PI;

            connectionLine.style.left = ax + 'px';
            connectionLine.style.top = ay + 'px';
            connectionLine.style.width = length + 'px';
            connectionLine.style.transform = `rotate(${angle}deg)`;
        }

        // Animate hash text
        async function animateHash(hash) {
            txHashEl.textContent = '';
            for (let i = 0; i < hash.length; i++) {
                txHashEl.textContent += hash[i];
                await sleep(40);
            }
        }

        // Animate layer selection (roulette effect)
        async function animateLayerSelection(selectedLayer, probs) {
            const layerProbEls = layerProbs.querySelectorAll('.layer-prob');
            const available = probs.map((p, i) => p > 0 ? i : -1).filter(i => i >= 0);
            
            // Fast spin
            for (let i = 0; i < 12; i++) {
                const randIdx = available[Math.floor(Math.random() * available.length)];
                layerProbEls.forEach((el, j) => el.classList.toggle('selected', j === randIdx));
                await sleep(80 + i * 15);
            }

            // Final selection
            layerProbEls.forEach((el, i) => el.classList.toggle('selected', i === selectedLayer - 1));
        }

        // Run simulation
        async function runSimulation() {
            if (isPlaying) return;
            isPlaying = true;
            playBtn.disabled = true;

            // 매 시뮬레이션마다 위치 랜덤화
            updateScenario(currentScenario, true);
            
            const s = scenarios[currentScenario];

            // Step 1: Show users with new positions
            setStep(1);
            await sleep(600);

            // Step 2: Connect users
            setStep(2);
            drawConnection();
            connectionLine.classList.add('active');
            await sleep(800);

            // Step 3: Generate hash
            setStep(3);
            const hash = generateHash();
            await animateHash(hash);
            await sleep(600);

            // Step 4: Layer selection
            setStep(4);
            const selectedLayer = selectLayer(s.probs);
            await animateLayerSelection(selectedLayer, s.probs);
            await sleep(400);

            // Step 5: Show result
            setStep(5);
            const layerNames = ['읍면동', '시군구', '광역시도', '국가', '글로벌'];
            const nodeName = s.nodes[selectedLayer - 1];

            resultLayerEl.textContent = 'L' + selectedLayer;
            resultLayerEl.className = 'result-layer selected';
            resultLayerEl.style.transform = 'scale(1.2)';
            await sleep(200);
            resultLayerEl.style.transform = 'scale(1)';

            resultNodeEl.textContent = nodeName + '에 기록';
            resultNoteEl.textContent = `${layerNames[selectedLayer - 1]} 계층 선택됨 (확률: ${s.probs[selectedLayer - 1]}%)`;

            isPlaying = false;
            playBtn.disabled = false;
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Event Listeners
        scenarioBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isPlaying) updateScenario(btn.dataset.scenario, true);
            });
        });

        playBtn.addEventListener('click', runSimulation);

        // Initialize
        init();
});
