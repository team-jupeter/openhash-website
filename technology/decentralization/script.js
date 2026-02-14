/**
 * 탈중앙화 페이지 - Slide Panel Interaction
 */

// SSI Section Data
const ssiData = {
    concept: {
        title: 'SSI(자기주권신원) 개념',
        icon: '🪪',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">탈중앙화</span>
                    <span class="label">핵심 원칙</span>
                </div>
                <div class="detail-stat">
                    <span class="value">사용자</span>
                    <span class="label">신원 통제 주체</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>기존 신원 인증의 문제</h4>
                <p>기존 시스템에서는 정부나 기업이 신원 정보를 <strong>중앙 집중식으로 관리</strong>합니다. 사용자는 자신의 정보에 대한 통제권이 없으며, 데이터 유출 시 피해를 고스란히 받습니다.</p>
                <h4>자기주권신원(SSI)이란?</h4>
                <p>SSI는 <strong>사용자가 자신의 신원 정보를 직접 소유하고 통제</strong>하는 패러다임입니다. 중앙 기관의 허가 없이도 자신의 신원을 증명할 수 있습니다.</p>
                <h4>OpenHash에서의 구현</h4>
                <p>신분증 원본은 사용자만 보유하고, OpenHash 네트워크에는 <strong>해시값만 분산 저장</strong>됩니다. 검증 시 원본과 해시를 대조하여 위변조 여부를 확인합니다.</p>
            </div>
        `
    },
    elements: {
        title: '신원 증명 5요소',
        icon: '🔐',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">5가지</span>
                    <span class="label">필수 검증 요소</span>
                </div>
                <div class="detail-stat">
                    <span class="value">동시 제시</span>
                    <span class="label">검증 조건</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>5요소 구성</h4>
                <ul>
                    <li><strong>① 신분증 원본:</strong> 사용자가 직접 보유한 디지털 신분증</li>
                    <li><strong>② 발행자 서명:</strong> 정부 기관의 디지털 서명 (위조 방지)</li>
                    <li><strong>③ 해시값:</strong> SHA-256으로 생성된 신분증 해시</li>
                    <li><strong>④ 계층/노드 정보:</strong> 해시가 저장된 계층과 노드 위치</li>
                    <li><strong>⑤ 저장 시각:</strong> 해시가 기록된 정확한 타임스탬프</li>
                </ul>
                <h4>위변조 불가 원리</h4>
                <p>5요소 중 하나라도 불일치하면 검증이 실패합니다. 공격자가 신분증을 위조하려면 <strong>원본, 서명, 해시, 노드 기록, 시각을 모두 조작</strong>해야 하며, 이는 현실적으로 불가능합니다.</p>
            </div>
        `
    },
    process: {
        title: '등록 및 검증 절차',
        icon: '⚙️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">4단계</span>
                    <span class="label">등록 프로세스</span>
                </div>
                <div class="detail-stat">
                    <span class="value">&lt;100ms</span>
                    <span class="label">검증 소요 시간</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>등록 절차</h4>
                <ul>
                    <li><strong>Step 1:</strong> 신분증을 SHA-256으로 해싱</li>
                    <li><strong>Step 2:</strong> 확률적 계층 선택 (70% L1, 20% L2, 8% L3, 2% L4)</li>
                    <li><strong>Step 3:</strong> 선택된 계층의 노드에 해시 저장</li>
                    <li><strong>Step 4:</strong> 정부 기관이 디지털 서명 추가</li>
                </ul>
                <h4>검증 절차</h4>
                <p>사용자가 5요소를 제시하면, 검증자는 해당 계층/노드에서 해시를 조회하여 <strong>원본 해시와 일치 여부</strong>를 확인합니다. 발행자 서명의 유효성도 함께 검증됩니다.</p>
            </div>
        `
    },
    privacy: {
        title: '프라이버시 보호',
        icon: '🛡️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">최소 노출</span>
                    <span class="label">핵심 원칙</span>
                </div>
                <div class="detail-stat">
                    <span class="value">선택적 공개</span>
                    <span class="label">사용자 권한</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>개인정보 최소 노출 원칙</h4>
                <p>OpenHash 네트워크에는 <strong>해시값만 저장</strong>됩니다. 실제 신분증 내용(이름, 생년월일 등)은 네트워크에 전혀 공개되지 않습니다.</p>
                <h4>선택적 공개</h4>
                <p>사용자는 상황에 따라 <strong>필요한 정보만 선택적으로 공개</strong>할 수 있습니다. 예: 성인 인증 시 생년월일만 공개, 나머지는 비공개</p>
                <h4>영지식 증명 확장</h4>
                <p>향후 ZKP(영지식 증명) 기술과 결합하여, 정보 자체를 공개하지 않고도 <strong>특정 조건 충족 여부만 증명</strong>하는 것이 가능합니다.</p>
            </div>
        `
    }
};

// Architecture Section Data
const archData = {
    layers: {
        title: '5단계 계층 구조',
        icon: '🏛️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">L1~L5</span>
                    <span class="label">계층 레벨</span>
                </div>
                <div class="detail-stat">
                    <span class="value">~3,750개</span>
                    <span class="label">국내 검증 노드</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>계층별 구성</h4>
                <ul>
                    <li><strong>L1 (읍면동):</strong> ~3,500개 노드, 소액 거래 70% 처리</li>
                    <li><strong>L2 (시군구):</strong> ~230개 노드, 중액 거래 처리</li>
                    <li><strong>L3 (광역시도):</strong> 17개 노드, 고액 거래 처리</li>
                    <li><strong>L4 (국가):</strong> 1개 노드, 국제 거래/최종 검증</li>
                    <li><strong>L5 (글로벌):</strong> 국가 간 거래 처리</li>
                </ul>
                <h4>물리적 계층 = 신뢰 계층</h4>
                <p>기존 이동통신망의 <strong>기지국 → 교환국 → 센터</strong> 구조를 그대로 활용합니다. 별도 인프라 없이 기존 네트워크가 신뢰 인프라로 전환됩니다.</p>
            </div>
        `
    },
    chains: {
        title: '6천만 해시 체인',
        icon: '🔗',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">5천만</span>
                    <span class="label">개인 해시 체인</span>
                </div>
                <div class="detail-stat">
                    <span class="value">1천만</span>
                    <span class="label">기관 해시 체인</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>독립적인 해시 체인</h4>
                <p>모든 사용자와 기관은 <strong>자신만의 해시 체인</strong>을 보유합니다. 각 체인은 독립적으로 운영되며, 계층 노드를 통해 상호 연결됩니다.</p>
                <h4>해시 체인 구조</h4>
                <p>각 체인은 <strong>이전 해시 + 현재 데이터 + 타임스탬프</strong>를 연결한 연속적인 구조입니다. 중간 데이터 수정 시 이후 모든 해시가 달라져 위변조가 즉시 탐지됩니다.</p>
                <h4>상호 연동</h4>
                <p>개인/기관 해시 체인의 머클 루트가 L1 노드에 제출되고, L1의 머클 루트는 L2로... 최종적으로 <strong>모든 해시가 계층적으로 연결</strong>됩니다.</p>
            </div>
        `
    },
    consensus: {
        title: 'LPBFT 합의 알고리즘',
        icon: '🤝',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">2f+1</span>
                    <span class="label">쿼럼 조건</span>
                </div>
                <div class="detail-stat">
                    <span class="value">f=1</span>
                    <span class="label">장애 허용 노드</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>LPBFT란?</h4>
                <p><strong>Layered Practical Byzantine Fault Tolerance</strong>의 약자로, 기존 PBFT를 계층 구조에 맞게 확장한 합의 알고리즘입니다.</p>
                <h4>합의 과정</h4>
                <ul>
                    <li><strong>Pre-prepare:</strong> 리더 노드가 거래 제안</li>
                    <li><strong>Prepare:</strong> 노드들이 제안 검증 후 동의 표시</li>
                    <li><strong>Commit:</strong> 2/3 이상 동의 시 거래 확정</li>
                </ul>
                <h4>계층 간 합의</h4>
                <p>각 계층 내에서 LPBFT로 합의 후, 머클 루트만 상위 계층으로 전달합니다. <strong>전역 합의 없이 로컬 합의만으로 무결성 보장</strong>이 가능합니다.</p>
            </div>
        `
    },
    propagation: {
        title: '머클 루트 전파',
        icon: '📤',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">32 bytes</span>
                    <span class="label">머클 루트 크기</span>
                </div>
                <div class="detail-stat">
                    <span class="value">배치 처리</span>
                    <span class="label">전파 방식</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>머클 트리 구조</h4>
                <p>여러 거래의 해시를 <strong>이진 트리 형태로 집계</strong>하여 단일 루트 해시를 생성합니다. 루트만 있으면 모든 거래의 무결성을 검증할 수 있습니다.</p>
                <h4>상위 계층 전파</h4>
                <p>L1 노드는 일정 주기(예: 1초)마다 해당 기간의 거래를 집계하여 <strong>머클 루트만 L2로 전송</strong>합니다. 전체 데이터가 아닌 32바이트만 전송되어 대역폭을 절약합니다.</p>
                <h4>무결성 검증</h4>
                <p>특정 거래의 무결성을 검증하려면, 해당 거래의 <strong>머클 경로(Merkle Proof)</strong>만 있으면 됩니다. 전체 데이터를 다운로드할 필요가 없습니다.</p>
            </div>
        `
    }
};

// Panel interaction logic
function setupPanelInteraction(cardsSelector, panelId, contentId, dataObj) {
    const cards = document.querySelectorAll(cardsSelector);
    const panel = document.getElementById(panelId);
    const content = document.getElementById(contentId);
    let activeCard = null;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            
            if (activeCard === card) {
                panel.classList.remove('open');
                card.classList.remove('active');
                activeCard = null;
            } else {
                if (activeCard) activeCard.classList.remove('active');
                card.classList.add('active');
                activeCard = card;
                
                const data = dataObj[type];
                content.innerHTML = `
                    <button class="detail-close" onclick="this.closest('.detail-panel').classList.remove('open'); document.querySelector('${cardsSelector}.active')?.classList.remove('active');">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <div class="detail-header">
                        <span class="icon">${data.icon}</span>
                        <h3>${data.title}</h3>
                    </div>
                    <div class="detail-body">
                        ${data.content}
                    </div>
                `;
                panel.classList.add('open');
            }
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupPanelInteraction('#ssi-cards .card', 'ssi-panel', 'ssi-content', ssiData);
    setupPanelInteraction('#arch-cards .card', 'arch-panel', 'arch-content', archData);
});
