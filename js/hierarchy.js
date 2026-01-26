const LayerData = {
    L5: {
        title: '글로벌 계층',
        badge: 'L5',
        role: '전 세계 최상위 검증 노드로서 국가 간 거래의 최종 검증을 담당합니다. 모든 국가 계층의 머클 루트를 집계하여 글로벌 데이터 정합성을 보장합니다.',
        probNormal: 2,
        probHigh: 10,
        nodes: 'Representative 노드 1개 (상위 10% 처리량 + 지리적 분산 기준, 1주일 임기로 재선정)',
        verify: [
            'BLS 서명으로 하위 국가 계층 데이터 집계 검증',
            '머클 루트 비교를 통한 글로벌 데이터 정합성 확인',
            '국가 간 거래 시 잔액 불변성의 최종 검증 수행'
        ]
    },
    L4: {
        title: '국가 계층',
        badge: 'L4',
        role: '국가 단위의 검증 및 규제 준수를 담당합니다. 해당 국가의 AML/CFT 규정, 금융 규제를 적용하고 광역시도 계층의 데이터를 집계합니다.',
        probNormal: 6,
        probHigh: 25,
        nodes: 'Representative 노드 1개 + 일반 노드 2~5개 (국가 규모에 따라 가변)',
        verify: [
            '국가별 규제 프레임워크 적용 (AML/CFT, 제재 목록)',
            '광역시도 계층 머클 루트 집계 및 검증',
            '타 국가와의 거래 시 글로벌 계층에 검증 요청'
        ]
    },
    L3: {
        title: '광역시도 계층',
        badge: 'L3',
        role: '광역 단위(시/도) 데이터 집계를 담당합니다. 시군구 계층의 거래를 집계하고, 광역 단위 통계 및 이상 패턴을 모니터링합니다.',
        probNormal: 12,
        probHigh: 30,
        nodes: 'Representative 노드 1개 + 일반 노드 3~7개 (인구 밀도에 따라 가변)',
        verify: [
            '시군구 계층 머클 루트 집계 및 정합성 검증',
            '광역 단위 이상 거래 패턴 탐지',
            '동일 광역시도 내 시군구 간 거래의 잔액 불변성 검증'
        ]
    },
    L2: {
        title: '시군구 계층',
        badge: 'L2',
        role: '기초자치단체 단위의 거래 처리를 담당합니다. 읍면동 계층의 데이터를 집계하고, 지역 내 거래의 1차 검증을 수행합니다.',
        probNormal: 30,
        probHigh: 20,
        nodes: 'Representative 노드 1개 + 일반 노드 5~10개 (관할 읍면동 수에 따라 가변)',
        verify: [
            '읍면동 계층 머클 루트 집계',
            '동일 시군구 내 거래의 잔액 불변성 실시간 검증',
            '5단계 거래 검증 파이프라인 중 1~3단계 수행'
        ]
    },
    L1: {
        title: '읍면동 계층',
        badge: 'L1',
        role: '최하위 계층으로서 실시간 거래 처리의 최전선을 담당합니다. 모든 사용자는 읍면동 계층에 소속되며, 일상적인 소액 거래의 대부분이 이 계층에서 처리됩니다.',
        probNormal: 50,
        probHigh: 15,
        nodes: 'Representative 노드 1개 + 일반 노드 7~15개 (거주 인구에 따라 가변)',
        verify: [
            '개별 트랜잭션의 즉시 기록 및 해시 체인 갱신',
            '동일 읍면동 내 거래는 로컬에서 즉시 확정',
            '상위 계층 동기화 전 로컬 해시 체인으로 무결성 유지'
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const layerCards = document.querySelectorAll('.layer-card[data-layer]');
    const detailPanel = document.getElementById('hierarchyDetail');
    
    if (!layerCards.length || !detailPanel) return;

    function updateDetail(layer) {
        const data = LayerData[layer];
        if (!data) return;

        // Update badge and title
        document.getElementById('detailBadge').textContent = data.badge;
        document.getElementById('detailBadge').className = 'detail-badge ' + layer;
        document.getElementById('detailTitle').textContent = data.title;
        
        // Update role
        document.getElementById('detailRole').textContent = data.role;
        
        // Update probability bars
        document.getElementById('probNormal').style.width = data.probNormal + '%';
        document.getElementById('probNormalVal').textContent = data.probNormal + '%';
        document.getElementById('probHigh').style.width = data.probHigh + '%';
        document.getElementById('probHighVal').textContent = data.probHigh + '%';
        
        // Update nodes
        document.getElementById('detailNodes').textContent = data.nodes;
        
        // Update verification list
        const verifyList = document.getElementById('detailVerify');
        verifyList.innerHTML = data.verify.map(function(item) {
            return '<li>' + item + '</li>';
        }).join('');

        // Animate panel
        detailPanel.classList.add('updated');
        setTimeout(function() {
            detailPanel.classList.remove('updated');
        }, 300);
    }

    layerCards.forEach(function(card) {
        card.addEventListener('click', function() {
            // Remove active from all
            layerCards.forEach(function(c) { c.classList.remove('active'); });
            // Add active to clicked
            this.classList.add('active');
            // Update detail
            updateDetail(this.dataset.layer);
        });
    });

    // Set default active
    layerCards[0].classList.add('active');
});
