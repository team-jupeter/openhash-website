/**
 * 새로운 웹(Agent Web) 페이지 - Slide Panel Interaction
 */

// Paradigm Section Data
const paradigmData = {
    web1: {
        title: 'Web 1.0: 읽기 전용 웹',
        icon: '📄',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">1990년대</span>
                    <span class="label">등장 시기</span>
                </div>
                <div class="detail-stat">
                    <span class="value">일방향</span>
                    <span class="label">정보 흐름</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>특징</h4>
                <p>웹사이트 소유자가 콘텐츠를 생산하고, 사용자는 <strong>읽기만</strong> 가능한 정적인 웹입니다. HTML 페이지로 구성된 단순한 구조였습니다.</p>
                <h4>데이터 주체</h4>
                <ul>
                    <li><strong>생산자:</strong> 웹마스터, 기업</li>
                    <li><strong>소비자:</strong> 일반 사용자 (읽기 전용)</li>
                </ul>
                <h4>한계</h4>
                <p>사용자 참여 불가, 상호작용 없음, 콘텐츠 업데이트가 느림</p>
            </div>
        `
    },
    web2: {
        title: 'Web 2.0: 소셜 웹',
        icon: '👥',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">2000년대</span>
                    <span class="label">등장 시기</span>
                </div>
                <div class="detail-stat">
                    <span class="value">양방향</span>
                    <span class="label">정보 흐름</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>특징</h4>
                <p>사용자가 콘텐츠를 <strong>직접 생산</strong>하는 참여형 웹입니다. SNS, 블로그, 위키 등 사용자 생성 콘텐츠(UGC)가 폭발적으로 증가했습니다.</p>
                <h4>데이터 주체</h4>
                <ul>
                    <li><strong>생산자:</strong> 모든 사용자</li>
                    <li><strong>소비자:</strong> 모든 사용자</li>
                    <li><strong>통제자:</strong> 플랫폼 기업 (Facebook, Google 등)</li>
                </ul>
                <h4>한계</h4>
                <p>데이터 소유권이 플랫폼에 귀속, 개인정보 유출 위험, 플랫폼 의존성</p>
            </div>
        `
    },
    web3: {
        title: 'Web 3.0: 블록체인 웹',
        icon: '🔗',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">2010년대</span>
                    <span class="label">등장 시기</span>
                </div>
                <div class="detail-stat">
                    <span class="value">탈중앙화</span>
                    <span class="label">핵심 가치</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>특징</h4>
                <p>블록체인 기반으로 <strong>중개자 없는 P2P 거래</strong>를 지향합니다. 암호화폐, NFT, DeFi 등이 등장했습니다.</p>
                <h4>데이터 주체</h4>
                <ul>
                    <li><strong>생산자:</strong> 사용자 (지갑 소유자)</li>
                    <li><strong>소비자:</strong> 사용자</li>
                    <li><strong>검증자:</strong> 채굴자/검증자 노드</li>
                </ul>
                <h4>한계</h4>
                <p>느린 속도, 높은 수수료, 막대한 에너지 소비, 기술적 진입 장벽, 실용성 부족</p>
            </div>
        `
    },
    agentweb: {
        title: 'Agent Web: AI 에이전트 웹',
        icon: '🤖',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">2020년대~</span>
                    <span class="label">등장 시기</span>
                </div>
                <div class="detail-stat highlight">
                    <span class="value">AI 중심</span>
                    <span class="label">핵심 변화</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>특징</h4>
                <p><strong>AI 에이전트가 데이터를 생산하고 소비</strong>하는 새로운 패러다임입니다. 사람은 의사결정만 하고, 실행은 AI가 담당합니다.</p>
                <h4>데이터 주체</h4>
                <ul>
                    <li><strong>생산자:</strong> AI 에이전트 (사람을 대신하여)</li>
                    <li><strong>소비자:</strong> AI 에이전트</li>
                    <li><strong>검증자:</strong> OpenHash 네트워크</li>
                    <li><strong>의사결정자:</strong> 사람 (최종 승인)</li>
                </ul>
                <h4>핵심 문제</h4>
                <p><strong>AI가 데이터의 진위를 어떻게 판단할 것인가?</strong><br>→ OpenHash가 유일한 해답입니다.</p>
            </div>
        `
    }
};

// Agent Section Data
const agentData = {
    personal: {
        title: '개인 AI 에이전트',
        icon: '🧑‍💼',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">1인 1에이전트</span>
                    <span class="label">배포 단위</span>
                </div>
                <div class="detail-stat">
                    <span class="value">24/7</span>
                    <span class="label">상시 가동</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>역할</h4>
                <p>사용자의 <strong>디지털 비서</strong>로서 데이터 관리, 문서 처리, 기관 연동을 자동으로 수행합니다. 사용자는 자연어로 명령만 내리면 됩니다.</p>
                <h4>주요 기능</h4>
                <ul>
                    <li><strong>데이터 금고 관리:</strong> 개인 문서, 증명서, 거래 내역 보관</li>
                    <li><strong>자동 처리:</strong> 세금 신고, 보험 청구, 각종 신청</li>
                    <li><strong>대리 협상:</strong> 가격 비교, 계약 검토, 조건 협상</li>
                    <li><strong>일정 관리:</strong> 예약, 알림, 리마인더</li>
                </ul>
                <h4>신뢰 보장</h4>
                <p>AI가 처리하는 모든 데이터와 결과는 <strong>OpenHash에 기록</strong>됩니다. 사용자는 언제든 AI의 행동을 검증할 수 있습니다.</p>
            </div>
        `
    },
    institutional: {
        title: '기관 AI 에이전트',
        icon: '🏛️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">정부/기업</span>
                    <span class="label">운영 주체</span>
                </div>
                <div class="detail-stat">
                    <span class="value">자동화</span>
                    <span class="label">서비스 방식</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>역할</h4>
                <p>정부 기관과 기업이 운영하는 <strong>자동화된 서비스 처리 시스템</strong>입니다. 민원, 신청, 조회 등을 AI가 자동으로 처리합니다.</p>
                <h4>적용 분야</h4>
                <ul>
                    <li><strong>국세청:</strong> 세금 계산, 신고 접수, 환급 처리</li>
                    <li><strong>건강보험공단:</strong> 보험료 산정, 청구 심사</li>
                    <li><strong>은행:</strong> 대출 심사, 계좌 관리, 이체 처리</li>
                    <li><strong>병원:</strong> 예약, 진료 기록 관리, 보험 청구</li>
                </ul>
                <h4>OpenHash 연동</h4>
                <p>기관 AI는 개인 AI가 보내온 데이터의 <strong>진실성을 OpenHash로 검증</strong>합니다. 위조 문서는 즉시 탐지되어 거부됩니다.</p>
            </div>
        `
    },
    interaction: {
        title: '에이전트 간 상호작용',
        icon: '🔄',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">AI ↔ AI</span>
                    <span class="label">통신 방식</span>
                </div>
                <div class="detail-stat">
                    <span class="value">자동 검증</span>
                    <span class="label">신뢰 메커니즘</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>AI-to-AI 프로토콜</h4>
                <p>Agent Web에서는 <strong>AI 에이전트끼리 직접 통신</strong>합니다. 사람의 개입 없이 데이터 교환, 검증, 처리가 자동으로 이루어집니다.</p>
                <h4>상호작용 과정</h4>
                <ul>
                    <li><strong>데이터 요청:</strong> 기관 AI → 개인 AI에게 필요 데이터 요청</li>
                    <li><strong>데이터 제공:</strong> 개인 AI → 데이터 금고에서 해당 데이터 추출</li>
                    <li><strong>진실성 증명:</strong> OpenHash 해시로 데이터 무결성 증명</li>
                    <li><strong>처리 및 기록:</strong> 결과를 양측 해시 체인에 기록</li>
                </ul>
                <h4>핵심 원칙</h4>
                <p>모든 AI 간 통신은 <strong>OpenHash로 기록</strong>되어 투명하게 추적 가능합니다. "믿음"이 아닌 <strong>"기술적 증명"</strong>에 기반합니다.</p>
            </div>
        `
    }
};

// Trust Section Data
const trustData = {
    problem: {
        title: 'AI 시대의 근본 문제',
        icon: '❓',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">Garbage In</span>
                    <span class="label">입력</span>
                </div>
                <div class="detail-stat">
                    <span class="value">Garbage Out</span>
                    <span class="label">출력</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>문제의 본질</h4>
                <p>AI는 데이터를 가공하는 기술입니다. 아무리 뛰어난 AI라도 <strong>입력 데이터가 거짓이면 결과도 거짓</strong>입니다.</p>
                <h4>구체적 질문들</h4>
                <ul>
                    <li>AI 의사가 환자의 진단서가 위조인지 어떻게 알 수 있을까요?</li>
                    <li>AI 판사가 증거 문서의 진위를 어떻게 판단할까요?</li>
                    <li>AI 은행원이 소득 증명서가 조작되었는지 어떻게 확인할까요?</li>
                </ul>
                <h4>기존 방식의 한계</h4>
                <p>현재의 각종 증명서(주민등록증, 졸업증명서, 진단서 등)는 <strong>사람이 보고 판단하는 것을 전제</strong>로 설계되었습니다. AI가 이를 검증할 기술적 방법이 없었습니다.</p>
            </div>
        `
    },
    solution: {
        title: 'OpenHash의 해법',
        icon: '✅',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">해시 체인</span>
                    <span class="label">핵심 기술</span>
                </div>
                <div class="detail-stat highlight">
                    <span class="value">기술적 증명</span>
                    <span class="label">신뢰 방식</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>작동 원리</h4>
                <p>모든 문서는 생성 시점에 <strong>SHA-256 해시가 OpenHash 네트워크에 기록</strong>됩니다. 이후 문서가 단 1비트라도 수정되면 해시가 달라져 위변조가 즉시 탐지됩니다.</p>
                <h4>AI의 검증 과정</h4>
                <ul>
                    <li><strong>Step 1:</strong> 문서를 받으면 SHA-256 해시 계산</li>
                    <li><strong>Step 2:</strong> OpenHash 네트워크에서 원본 해시 조회</li>
                    <li><strong>Step 3:</strong> 두 해시가 일치하면 진본, 불일치하면 위조</li>
                </ul>
                <h4>유일한 해법</h4>
                <p>블록체인은 느리고 비효율적입니다. 중앙 서버는 해킹 위험이 있습니다. <strong>OpenHash만이 실용적이고 안전하게 AI 시대의 데이터 진실성을 보장</strong>합니다.</p>
            </div>
        `
    },
    vault: {
        title: '데이터 금고 (Vault)',
        icon: '🔐',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">개인/기관</span>
                    <span class="label">소유 주체</span>
                </div>
                <div class="detail-stat">
                    <span class="value">완전 통제</span>
                    <span class="label">사용자 권한</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>데이터 금고란?</h4>
                <p>개인 또는 기관이 보유한 <strong>검증된 데이터의 보관소</strong>입니다. 모든 데이터는 OpenHash에 해시가 등록되어 진실성이 보장됩니다.</p>
                <h4>저장 대상</h4>
                <ul>
                    <li><strong>신원 정보:</strong> 신분증, 여권, 운전면허</li>
                    <li><strong>학력/경력:</strong> 졸업증명서, 성적표, 경력증명서</li>
                    <li><strong>의료 기록:</strong> 진단서, 처방전, 건강검진 결과</li>
                    <li><strong>금융 정보:</strong> 소득증명, 재산세 납부, 신용 정보</li>
                    <li><strong>부동산:</strong> 등기부등본, 계약서, 권리증</li>
                </ul>
                <h4>접근 통제</h4>
                <p>사용자가 <strong>선택적으로 데이터 접근 권한을 부여</strong>합니다. AI 에이전트도 사용자 승인 없이는 금고에 접근할 수 없습니다.</p>
            </div>
        `
    },
    certificate: {
        title: '디지털 증명서',
        icon: '📜',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">수천 종</span>
                    <span class="label">증명서 유형</span>
                </div>
                <div class="detail-stat highlight">
                    <span class="value">위변조 불가</span>
                    <span class="label">보안 수준</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>디지털 전환</h4>
                <p>기존의 종이 증명서가 <strong>디지털 문서 + OpenHash 해시</strong>로 전환됩니다. 물리적 서류 없이 모든 증명이 가능해집니다.</p>
                <h4>증명서 유형</h4>
                <ul>
                    <li><strong>신원:</strong> 주민등록증, 여권, 운전면허증</li>
                    <li><strong>학력:</strong> 졸업증명서, 성적증명서, 학위증</li>
                    <li><strong>경력:</strong> 재직증명서, 경력증명서, 자격증</li>
                    <li><strong>의료:</strong> 진단서, 건강검진결과, 예방접종증명</li>
                    <li><strong>부동산:</strong> 등기부등본, 건축물대장</li>
                    <li><strong>금융:</strong> 소득금액증명, 납세증명서</li>
                </ul>
                <h4>실시간 검증</h4>
                <p>제출 즉시 OpenHash에서 <strong>자동으로 진위 확인</strong>됩니다. 위조 문서는 절대 통과할 수 없습니다.</p>
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
    setupPanelInteraction('#paradigm-cards .card', 'paradigm-panel', 'paradigm-content', paradigmData);
    setupPanelInteraction('#agent-cards .card', 'agent-panel', 'agent-content', agentData);
    setupPanelInteraction('#trust-cards .card', 'trust-panel', 'trust-content', trustData);
});
