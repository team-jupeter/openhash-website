// 오픈해시 기반 금융 감독 시스템
(function() {
    'use strict';

    // 샘플 데이터
    const sampleData = {
        individuals: [
            { name: '홍길동', layer: 'KR-JEJU-SEOGWIPO-JUNGMUN', assets: '2,450만 T', liabilities: '850만 T', netWorth: '1,600만 T' },
            { name: '김철수', layer: 'KR-JEJU-JEJU-NOHYUNG', assets: '1,890만 T', liabilities: '420만 T', netWorth: '1,470만 T' },
            { name: '이영희', layer: 'KR-SEOUL-GANGNAM-YEOKSAM', assets: '5,200만 T', liabilities: '1,200만 T', netWorth: '4,000만 T' }
        ],
        corporations: [
            { name: 'AI City Inc.', layer: 'KR-JEJU-JEJU', totalAssets: '2,500억 T', totalLiabilities: '800억 T', revenue: '450억 T', profit: '95억 T' },
            { name: 'OpenHash Tech', layer: 'KR-SEOUL-GANGNAM', totalAssets: '1,200억 T', totalLiabilities: '350억 T', revenue: '280억 T', profit: '72억 T' },
            { name: 'Digital Finance', layer: 'KR-BUSAN-HAEUNDAE', totalAssets: '3,800억 T', totalLiabilities: '1,500억 T', revenue: '620억 T', profit: '145억 T' }
        ],
        vaultTypes: [
            { type: '금융', desc: '은행거래, 투자, 보험 기록' },
            { type: '의료', desc: '건강검진, 진료, 처방 기록' },
            { type: '교육', desc: '학력, 자격증, 수료 기록' },
            { type: '행정', desc: '주민등록, 인허가, 증명서' },
            { type: '교통', desc: '운전면허, 차량, 통행 기록' },
            { type: '일반', desc: '기타 개인 데이터' }
        ]
    };

    // 검증 단계
    const verifySteps = [
        { name: '문서 해시 생성', desc: 'SHA-256 해싱', time: 2 },
        { name: '계층 정보 조회', desc: '저장 노드 확인', time: 5 },
        { name: 'BLS 서명 검증', desc: '발행자 서명 확인', time: 8 },
        { name: 'Merkle Proof 검증', desc: '경로 무결성 확인', time: 12 },
        { name: '해시 체인 정합성', desc: '연결성 검증', time: 15 },
        { name: '계층 간 교차 검증', desc: '상하위 크로스체크', time: 20 },
        { name: '인증서 발행', desc: '오픈해시 기록', time: 25 }
    ];

    // 5단계 계층 구조
    const layers = [
        { level: 5, name: '글로벌', code: 'GLOBAL' },
        { level: 4, name: '국가', code: 'KR' },
        { level: 3, name: '광역시도', code: 'KR-JEJU' },
        { level: 2, name: '시군구', code: 'KR-JEJU-SEOGWIPO' },
        { level: 1, name: '읍면동', code: 'KR-JEJU-SEOGWIPO-JUNGMUN' }
    ];

    // 상태
    let state = {
        verifyType: 'individual',
        selectedTarget: 0,
        isVerifying: false,
        verifyComplete: false
    };

    // 초기화
    function init() {
        setupEventListeners();
        updateTargetInfo();
        updateStats();
        initLayerViz();
    }

    // 이벤트 리스너
    function setupEventListeners() {
        // 카드 클릭
        document.querySelectorAll('.feature-card').forEach((card, idx) => {
            card.addEventListener('click', () => togglePanel(idx));
        });

        // 검증 유형 변경
        document.getElementById('verifyType')?.addEventListener('change', (e) => {
            state.verifyType = e.target.value;
            updateTargetSelect();
            updateTargetInfo();
        });

        // 대상 선택 변경
        document.getElementById('targetSelect')?.addEventListener('change', (e) => {
            state.selectedTarget = parseInt(e.target.value);
            updateTargetInfo();
        });

        // 검증 버튼
        document.getElementById('verifyBtn')?.addEventListener('click', startVerification);

        // 모달 닫기
        document.querySelector('.modal-close')?.addEventListener('click', closeModal);
        document.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) closeModal();
        });

        // 패널 닫기 버튼
        document.querySelectorAll('.panel-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllPanels();
            });
        });
    }

    // 패널 토글
    function togglePanel(idx) {
        const cards = document.querySelectorAll('.feature-card');
        const panel = document.getElementById('detailPanel');
        const contents = document.querySelectorAll('.panel-content-item');

        const isActive = cards[idx].classList.contains('active');
        cards.forEach(c => c.classList.remove('active'));
        contents.forEach(c => c.classList.add('hidden'));

        if (!isActive) {
            cards[idx].classList.add('active');
            contents[idx]?.classList.remove('hidden');
            panel.classList.add('open');
        } else {
            panel.classList.remove('open');
        }
    }

    function closeAllPanels() {
        document.querySelectorAll('.feature-card').forEach(c => c.classList.remove('active'));
        document.getElementById('detailPanel')?.classList.remove('open');
    }

    // 대상 선택 업데이트
    function updateTargetSelect() {
        const select = document.getElementById('targetSelect');
        if (!select) return;

        const data = state.verifyType === 'individual' ? sampleData.individuals :
                     state.verifyType === 'corporation' ? sampleData.corporations : null;

        select.innerHTML = '';
        if (data) {
            data.forEach((item, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = item.name;
                select.appendChild(opt);
            });
        } else {
            sampleData.vaultTypes.forEach((item, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = `${item.type} 서랍 - ${item.desc}`;
                select.appendChild(opt);
            });
        }
        state.selectedTarget = 0;
    }

    // 대상 정보 업데이트
    function updateTargetInfo() {
        const container = document.getElementById('targetInfo');
        if (!container) return;

        let html = '';
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

        if (state.verifyType === 'individual') {
            const target = sampleData.individuals[state.selectedTarget];
            html = `
                <div class="target-row"><span class="target-label">이름</span><span class="target-value">${target.name}</span></div>
                <div class="target-row"><span class="target-label">소속 계층</span><span class="target-value">${target.layer}</span></div>
                <div class="target-row"><span class="target-label">총 자산</span><span class="target-value">${target.assets}</span></div>
                <div class="target-row"><span class="target-label">총 부채</span><span class="target-value">${target.liabilities}</span></div>
                <div class="target-row"><span class="target-label">순자산</span><span class="target-value">${target.netWorth}</span></div>
                <div class="target-row"><span class="target-label">기준일</span><span class="target-value">${timestamp}</span></div>
            `;
        } else if (state.verifyType === 'corporation') {
            const target = sampleData.corporations[state.selectedTarget];
            html = `
                <div class="target-row"><span class="target-label">기업명</span><span class="target-value">${target.name}</span></div>
                <div class="target-row"><span class="target-label">소속 계층</span><span class="target-value">${target.layer}</span></div>
                <div class="target-row"><span class="target-label">자산총계</span><span class="target-value">${target.totalAssets}</span></div>
                <div class="target-row"><span class="target-label">부채총계</span><span class="target-value">${target.totalLiabilities}</span></div>
                <div class="target-row"><span class="target-label">매출액</span><span class="target-value">${target.revenue}</span></div>
                <div class="target-row"><span class="target-label">당기순이익</span><span class="target-value">${target.profit}</span></div>
            `;
        } else {
            const target = sampleData.vaultTypes[state.selectedTarget];
            html = `
                <div class="target-row"><span class="target-label">서랍 유형</span><span class="target-value">${target.type}</span></div>
                <div class="target-row"><span class="target-label">데이터 유형</span><span class="target-value">${target.desc}</span></div>
                <div class="target-row"><span class="target-label">소유자</span><span class="target-value">홍길동</span></div>
                <div class="target-row"><span class="target-label">등록 시점</span><span class="target-value">2025-11-20 10:45:33</span></div>
                <div class="target-row"><span class="target-label">발행자</span><span class="target-value">국민건강보험공단</span></div>
            `;
        }

        // 해시 생성
        const hash = generateHash();
        html += `
            <div class="hash-display">
                <div class="hash-label">문서 해시 (SHA-256)</div>
                <div class="hash-value">${hash}</div>
            </div>
        `;
        container.innerHTML = html;
    }

    // 해시 생성 (시뮬레이션)
    function generateHash() {
        const chars = '0123456789abcdef';
        let hash = '';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    // 계층 시각화 초기화
    function initLayerViz() {
        const container = document.getElementById('layerViz');
        if (!container) return;

        let html = '';
        layers.forEach((layer, idx) => {
            html += `
                <div class="layer-item" data-level="${layer.level}">
                    <div class="layer-num">${layer.level}</div>
                    <div class="layer-name">${layer.name}</div>
                    <div class="layer-code">${layer.code}</div>
                    <div class="layer-status">대기</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 통계 업데이트
    function updateStats() {
        // 시뮬레이션 통계
        animateValue('statTotal', 0, 12456789, 2000);
        animateValue('statToday', 0, 34567, 1500);
    }

    function animateValue(id, start, end, duration) {
        const el = document.getElementById(id);
        if (!el) return;

        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(start + (end - start) * easeOutCubic(progress));
            el.textContent = value.toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // 검증 시작
    function startVerification() {
        if (state.isVerifying) return;
        state.isVerifying = true;
        state.verifyComplete = false;

        // 모달 열기
        const modal = document.getElementById('verifyModal');
        modal?.classList.add('active');

        // 단계 초기화
        const stepsContainer = document.getElementById('verifySteps');
        stepsContainer.innerHTML = verifySteps.map((step, idx) => `
            <div class="v-step" data-step="${idx}">
                <div class="v-num">${idx + 1}</div>
                <div class="v-text">${step.name}</div>
                <div class="v-time">-</div>
            </div>
        `).join('');

        // 프로그레스 초기화
        document.querySelector('.progress-fill').style.width = '0%';
        document.getElementById('modalStatus').textContent = '검증 시작...';

        // 단계별 실행
        runVerifySteps(0);
    }

    function runVerifySteps(stepIdx) {
        if (stepIdx >= verifySteps.length) {
            completeVerification();
            return;
        }

        const step = verifySteps[stepIdx];
        const stepEl = document.querySelector(`.v-step[data-step="${stepIdx}"]`);
        stepEl?.classList.add('active');

        // 계층 시각화 업데이트
        updateLayerViz(stepIdx);

        // 상태 업데이트
        document.getElementById('modalStatus').textContent = step.desc;
        document.querySelector('.progress-fill').style.width = `${((stepIdx + 1) / verifySteps.length) * 100}%`;

        // 지연 후 완료
        setTimeout(() => {
            stepEl?.classList.remove('active');
            stepEl?.classList.add('done');
            stepEl.querySelector('.v-time').textContent = `${step.time}ms`;
            runVerifySteps(stepIdx + 1);
        }, 300 + Math.random() * 200);
    }

    function updateLayerViz(stepIdx) {
        const layerItems = document.querySelectorAll('.layer-item');
        if (stepIdx < 5) {
            // 하위 계층부터 검증
            const targetIdx = 4 - stepIdx;
            if (targetIdx >= 0 && targetIdx < layerItems.length) {
                layerItems[targetIdx].classList.add('active');
                layerItems[targetIdx].querySelector('.layer-status').textContent = '검증중...';
            }
            if (targetIdx < 4) {
                layerItems[targetIdx + 1]?.classList.remove('active');
                layerItems[targetIdx + 1]?.classList.add('done');
                layerItems[targetIdx + 1].querySelector('.layer-status').textContent = '✓ 완료';
            }
        } else {
            layerItems.forEach(item => {
                item.classList.remove('active');
                item.classList.add('done');
                item.querySelector('.layer-status').textContent = '✓ 완료';
            });
        }
    }

    function completeVerification() {
        state.isVerifying = false;
        state.verifyComplete = true;

        document.getElementById('modalStatus').textContent = '검증 완료 - 인증서 발행됨';
        document.querySelector('.progress-fill').style.width = '100%';

        // 결과 표시
        showResult();

        // 3초 후 모달 닫기
        setTimeout(closeModal, 3000);
    }

    function showResult() {
        const resultSection = document.getElementById('resultSection');
        const certSection = document.getElementById('certSection');

        if (resultSection) resultSection.classList.remove('hidden');
        if (certSection) certSection.classList.remove('hidden');

        // 인증서 정보 업데이트
        const certHash = document.getElementById('certHash');
        if (certHash) certHash.textContent = generateHash();

        const certTime = document.getElementById('certTime');
        if (certTime) {
            const now = new Date();
            certTime.textContent = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')} KST`;
        }
    }

    function closeModal() {
        document.getElementById('verifyModal')?.classList.remove('active');
    }

    // DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
