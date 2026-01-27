/**
 * Problem Cards - Slide Out/In Panel Interaction
 * Material Design inspired expansion panel
 */

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.problem-card');
    const detailPanel = document.getElementById('problem-detail-panel');
    const detailContent = document.getElementById('problem-detail-content');
    const closeBtn = document.getElementById('problem-detail-close');
    
    let activeCard = null;

    // 각 카드의 상세 내용
    const cardDetails = {
        energy: {
            title: '막대한 에너지 소비',
            icon: '⚡',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">121 TWh</span>
                        <span class="stat-label">비트코인 연간 전력 소비</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">아르헨티나</span>
                        <span class="stat-label">국가 전체 소비량과 동등</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>왜 이렇게 많은 에너지가 필요할까요?</h4>
                    <p>비트코인의 <strong>작업증명(Proof of Work)</strong> 방식은 복잡한 수학 문제를 푸는 경쟁을 통해 블록을 생성합니다. 전 세계 채굴자들이 24시간 고성능 컴퓨터를 가동하며, 이 과정에서 막대한 전력이 소모됩니다.</p>
                    <h4>OpenHash의 해결책</h4>
                    <p>OpenHash는 <strong>작업증명 없이</strong> 기존 통신 인프라의 물리적 계층 구조를 신뢰 기반으로 활용합니다. 해시 체인과 머클 트리만으로 데이터 무결성을 보장하여 <strong>98.5%의 에너지를 절감</strong>합니다.</p>
                </div>
            `
        },
        speed: {
            title: '느린 처리 속도',
            icon: '🕐',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">10분</span>
                        <span class="stat-label">비트코인 블록 생성</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">12초</span>
                        <span class="stat-label">이더리움 블록 생성</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">7 TPS</span>
                        <span class="stat-label">비트코인 초당 처리량</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>왜 이렇게 느릴까요?</h4>
                    <p>블록체인은 <strong>전 세계 노드가 동일한 상태를 유지</strong>해야 합니다. 새 블록이 생성되면 모든 노드에 전파되고 검증되어야 하므로, 의도적으로 블록 생성 간격을 늘려 네트워크 안정성을 확보합니다.</p>
                    <h4>OpenHash의 해결책</h4>
                    <p>OpenHash는 <strong>계층적 로컬 처리</strong>를 통해 대부분의 거래를 해당 지역(L1-L2)에서 즉시 처리합니다. 상위 계층으로의 전파는 배치 처리되어 <strong>4ms 이내 검증</strong>이 가능합니다.</p>
                </div>
            `
        },
        centralization: {
            title: '권력 집중',
            icon: '👥',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">4개 풀</span>
                        <span class="stat-label">비트코인 해시파워 50% 점유</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">32 ETH</span>
                        <span class="stat-label">이더리움 검증자 최소 스테이킹</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>탈중앙화의 역설</h4>
                    <p><strong>작업증명(PoW)</strong>은 대규모 채굴 풀로, <strong>지분증명(PoS)</strong>은 대형 자본가에게 권력이 집중됩니다. "부익부 빈익빈" 현상으로 일반 사용자는 네트워크 운영에서 소외됩니다.</p>
                    <h4>OpenHash의 해결책</h4>
                    <p>OpenHash는 <strong>행정 계층 구조</strong>를 활용합니다. 각 읍면동(L1)부터 국가(L4)까지 기존 거버넌스 체계가 노드를 운영하며, 특정 주체의 독점이 구조적으로 불가능합니다.</p>
                </div>
            `
        },
        sync: {
            title: '동기화 부담',
            icon: '🔄',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">500+ GB</span>
                        <span class="stat-label">비트코인 풀노드 용량</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">1+ TB</span>
                        <span class="stat-label">이더리움 아카이브 노드</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>전역 일관성의 비용</h4>
                    <p>블록체인의 모든 노드는 <strong>전체 거래 이력을 동일하게 유지</strong>해야 합니다. 신규 노드가 네트워크에 참여하려면 수백 GB의 데이터를 다운로드하고 검증해야 하며, 이는 확장성을 심각하게 저해합니다.</p>
                    <h4>OpenHash의 해결책</h4>
                    <p>OpenHash는 <strong>계층별 분산 저장</strong>을 채택합니다. 각 노드는 자신의 계층과 하위 계층 데이터만 관리하며, 상위 계층에는 머클 루트만 전파됩니다. 거래당 <strong>128 bytes</strong>의 경량 데이터로 무결성을 보장합니다.</p>
                </div>
            `
        }
    };

    // 카드 클릭 이벤트
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cardType = card.dataset.type;
            
            if (activeCard === card) {
                // 같은 카드 클릭 시 닫기
                closePanel();
            } else {
                // 다른 카드 클릭 시 전환
                if (activeCard) {
                    activeCard.classList.remove('active');
                }
                card.classList.add('active');
                activeCard = card;
                showDetail(cardType);
            }
        });
    });

    // 닫기 버튼
    if (closeBtn) {
        closeBtn.addEventListener('click', closePanel);
    }

    function showDetail(type) {
        const detail = cardDetails[type];
        if (!detail) return;

        detailContent.innerHTML = `
            <div class="detail-header">
                <span class="detail-icon">${detail.icon}</span>
                <h3>${detail.title}</h3>
            </div>
            <div class="detail-body">
                ${detail.content}
            </div>
        `;

        // 패널 열기 애니메이션
        detailPanel.classList.add('open');
    }

    function closePanel() {
        detailPanel.classList.remove('open');
        if (activeCard) {
            activeCard.classList.remove('active');
            activeCard = null;
        }
    }
});
