/**
 * Performance Cards - Slide Out/In Panel Interaction
 * 특허출원서 기반 상세 기술 설명
 */

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.perf-card');
    const detailPanel = document.getElementById('perf-detail-panel');
    const detailContent = document.getElementById('perf-detail-content');

    if (!detailPanel || !detailContent) return;

    let activeCard = null;

    const cardDetails = {
        energy: {
            title: '에너지 효율',
            icon: '⚡',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">121 TWh</span>
                        <span class="stat-label">Bitcoin 연간 소비</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">~1.8 TWh</span>
                        <span class="stat-label">OpenHash 연간 소비</span>
                    </div>
                    <div class="detail-stat highlight">
                        <span class="stat-value">98.5%</span>
                        <span class="stat-label">에너지 절감률</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>왜 이렇게 효율적인가?</h4>
                    <p>Bitcoin은 <strong>작업증명(Proof of Work)</strong> 방식으로, 전 세계 채굴자들이 복잡한 암호 퍼즐을 경쟁적으로 풀어야 합니다. 이 과정에서 막대한 연산 자원과 전력이 소모됩니다.</p>
                    <h4>OpenHash의 기술 원리</h4>
                    <p>OpenHash는 <strong>작업증명을 완전히 제거</strong>했습니다. 대신 <strong>SHA-256 해시 체인</strong>과 <strong>Merkle Tree</strong> 구조만으로 데이터 무결성을 보장합니다.</p>
                    <p>복잡한 암호 퍼즐 연산 없이, 단순 해시 연산만 수행하므로 일반 서버 수준의 하드웨어로도 충분히 운영 가능합니다.</p>
                </div>
            `
        },
        speed: {
            title: '검증 속도',
            icon: '🚀',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">10분</span>
                        <span class="stat-label">Bitcoin 블록 생성</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">4ms</span>
                        <span class="stat-label">OpenHash 검증</span>
                    </div>
                    <div class="detail-stat highlight">
                        <span class="stat-value">150,000배</span>
                        <span class="stat-label">속도 향상</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>블록체인이 느린 이유</h4>
                    <p>블록체인은 <strong>전 세계 모든 노드가 동일한 상태를 유지</strong>해야 합니다. 새 블록이 생성되면 모든 노드에 전파되고 검증되어야 하므로, 의도적으로 블록 생성 간격을 늘립니다.</p>
                    <h4>OpenHash의 계층적 로컬 처리</h4>
                    <p>OpenHash는 <strong>LPBFT(Layered Practical Byzantine Fault Tolerance)</strong> 합의 알고리즘을 사용합니다.</p>
                    <p>거래의 <strong>70%는 L1(읍면동) 계층에서 즉시 처리</strong>되며, 상위 계층으로는 머클 루트만 배치 전파됩니다. 전역 동기화 없이 로컬에서 검증이 완료됩니다.</p>
                </div>
            `
        },
        bandwidth: {
            title: '대역폭 효율',
            icon: '📡',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">~128</span>
                        <span class="stat-label">거래당 전송량 (bytes)</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">90%</span>
                        <span class="stat-label">대역폭 절감</span>
                    </div>
                    <div class="detail-stat highlight">
                        <span class="stat-value">0%</span>
                        <span class="stat-label">기존 트래픽 부하</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>블록체인의 동기화 부담</h4>
                    <p>블록체인은 모든 노드가 <strong>전체 거래 이력을 동일하게 복제</strong>해야 합니다. Bitcoin 풀노드는 500GB 이상, Ethereum 아카이브 노드는 1TB 이상의 데이터를 저장합니다.</p>
                    <h4>OpenHash의 계층별 분산 저장</h4>
                    <p>OpenHash에서 각 노드는 <strong>자신의 계층과 하위 계층 데이터만 관리</strong>합니다. 상위 계층에는 <strong>머클 루트(32 bytes)만 전파</strong>됩니다.</p>
                    <p>전체 거래 데이터는 해당 계층에서만 보관되므로, 네트워크 대역폭과 저장 공간을 획기적으로 절약합니다.</p>
                </div>
            `
        },
        infra: {
            title: '인프라 비용',
            icon: '🏗️',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat highlight">
                        <span class="stat-value">100%</span>
                        <span class="stat-label">인프라 투자 절감</span>
                    </div>
                    <div class="detail-stat highlight">
                        <span class="stat-value">80-90%</span>
                        <span class="stat-label">유지보수 비용 절감</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>기존 통신 인프라 재활용</h4>
                    <p>OpenHash는 <strong>별도의 전용 네트워크를 구축하지 않습니다</strong>. 전국의 이동통신 기지국과 통신 인프라는 이미 <strong>읍면동 → 시군구 → 광역시도 → 국가</strong>의 계층 구조로 구축되어 있습니다.</p>
                    <h4>물리적 계층 = 신뢰 인프라</h4>
                    <p>이 물리적 계층 구조가 곧 OpenHash의 <strong>검증 노드 배치 경로</strong>가 됩니다. 기지국 → 교환국 → 센터로 이어지는 기존 통신 경로 위에 소프트웨어 레이어만 추가합니다.</p>
                    <p>네트워크는 단순한 데이터 전송 수단이 아닌, <strong>신뢰 인프라</strong>로 재해석됩니다. 전국 3,500개 읍면동, 230개 시군구, 17개 광역시도가 자연스럽게 검증 노드 역할을 수행합니다.</p>
                </div>
            `
        }
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cardType = card.dataset.type;

            if (activeCard === card) {
                closePanel();
            } else {
                if (activeCard) {
                    activeCard.classList.remove('active');
                }
                card.classList.add('active');
                activeCard = card;
                showDetail(cardType);
            }
        });
    });

    function showDetail(type) {
        const detail = cardDetails[type];
        if (!detail) return;

        detailContent.innerHTML = `
            <button class="perf-detail-close" id="perf-detail-close-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="detail-header">
                <span class="detail-icon">${detail.icon}</span>
                <h3>${detail.title}</h3>
            </div>
            <div class="detail-body">
                ${detail.content}
            </div>
        `;

        const innerClose = document.getElementById('perf-detail-close-inner');
        if (innerClose) {
            innerClose.addEventListener('click', closePanel);
        }

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
