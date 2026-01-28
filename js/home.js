/**
 * OpenHash 홈 페이지 - Slide Panel Interactions
 */

// Problem Section Data
const problemData = {
    energy: {
        title: '막대한 에너지 소비',
        icon: '⚡',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">121 TWh</span>
                    <span class="label">Bitcoin 연간 소비</span>
                </div>
                <div class="detail-stat highlight">
                    <span class="value">아르헨티나</span>
                    <span class="label">국가 전체 소비량</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>문제점</h4>
                <p>비트코인의 작업증명(PoW) 방식은 복잡한 암호 퍼즐을 풀기 위해 <strong>막대한 연산력</strong>을 소모합니다.</p>
                <h4>환경 영향</h4>
                <p>연간 전력 소비량이 <strong>중소 국가 전체 소비량</strong>에 맞먹으며, 탄소 배출 문제가 심각합니다.</p>
            </div>
        `
    },
    speed: {
        title: '느린 처리 속도',
        icon: '⏱️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">10분</span>
                    <span class="label">Bitcoin 블록 생성</span>
                </div>
                <div class="detail-stat">
                    <span class="value">12초</span>
                    <span class="label">Ethereum 블록 생성</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>문제점</h4>
                <p>전 세계 노드가 동일한 상태를 유지해야 하므로, <strong>의도적으로 블록 생성 간격을 늘립니다.</strong></p>
                <h4>실용성 한계</h4>
                <p>실시간 결제나 대량 거래 처리에 <strong>근본적으로 부적합</strong>합니다.</p>
            </div>
        `
    },
    centralization: {
        title: '권력 집중',
        icon: '👥',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">4개</span>
                    <span class="label">Bitcoin 채굴풀 과점</span>
                </div>
                <div class="detail-stat highlight">
                    <span class="value">51%+</span>
                    <span class="label">상위 풀 점유율</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>PoW의 역설</h4>
                <p>탈중앙화를 표방하지만, 실제로는 <strong>대형 채굴 풀</strong>에 권력이 집중됩니다.</p>
                <h4>PoS도 마찬가지</h4>
                <p>지분증명은 <strong>대형 지분 보유자</strong>에게 권력이 집중되어, 부익부 빈익빈 현상이 발생합니다.</p>
            </div>
        `
    },
    incentive: {
        title: '동기화 부담',
        icon: '🔄',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">500GB+</span>
                    <span class="label">Bitcoin 풀노드</span>
                </div>
                <div class="detail-stat">
                    <span class="value">1TB+</span>
                    <span class="label">Ethereum 아카이브</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>문제점</h4>
                <p>모든 노드가 <strong>전체 거래 이력을 동일하게 복제</strong>해야 합니다.</p>
                <h4>진입 장벽</h4>
                <p>일반 사용자가 풀노드를 운영하기 어려워, <strong>네트워크 참여가 제한</strong>됩니다.</p>
            </div>
        `
    }
};

// Value Section Data
const valueData = {
    economic: {
        title: '경제적 효용',
        icon: '💰',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">AI 시대</span>
                    <span class="label">필수 인프라</span>
                </div>
                <div class="detail-stat">
                    <span class="value">유일한 해법</span>
                    <span class="label">데이터 진실성</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>AI 시대의 핵심 문제</h4>
                <p>AI가 데이터를 생산하고 소비하는 시대, <strong>데이터의 진위를 어떻게 판단할 것인가?</strong></p>
                <h4>OpenHash의 역할</h4>
                <p>신분증, 졸업증명서, 진단서 등 모든 문서가 AI에 의해 처리됩니다. OpenHash는 <strong>AI가 데이터 진실성을 검증할 수 있는 유일한 기술적 해법</strong>입니다.</p>
            </div>
        `
    },
    worth: {
        title: '기술의 가치',
        icon: '🏆',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">500조</span>
                    <span class="label">ChatGPT 추정</span>
                </div>
                <div class="detail-stat">
                    <span class="value">300조</span>
                    <span class="label">Claude 추정</span>
                </div>
                <div class="detail-stat highlight">
                    <span class="value">1경</span>
                    <span class="label">Gemini 추정</span>
                </div>
                <div class="detail-stat">
                    <span class="value">1500조</span>
                    <span class="label">DeepSeek 추정</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>AI 모델의 가치 평가</h4>
                <p>"OpenHash 기술이 국가/사회 전반에 적용된다고 가정하고, 객관적이고 보수적 관점에서 경제적 가치를 평가해 주세요."</p>
                <p>주요 AI 모델들이 <strong>수백조 ~ 수천조 원</strong>의 경제적 가치를 추정했습니다.</p>
            </div>
        `
    },
    rebirth: {
        title: '재조산하(再造山河)',
        icon: '🇰🇷',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight">
                    <span class="value">한국</span>
                    <span class="label">유일한 보유국</span>
                </div>
                <div class="detail-stat">
                    <span class="value">최적 환경</span>
                    <span class="label">배포 조건</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>한국의 기회</h4>
                <p>AI 기술 주도권은 미국과 중국에 있지만, <strong>OpenHash는 한국이 유일하게 보유한 원천 기술</strong>입니다.</p>
                <h4>왜 한국인가?</h4>
                <p>• 세계 최고 수준의 통신 인프라<br>• 새로운 기술에 대한 낮은 저항감<br>• 글로벌 Top 10 경제 규모<br>• 반도체 등 기반 기술 역량</p>
            </div>
        `
    },
    fairness: {
        title: '기본 소득과 공정한 사회',
        icon: '⚖️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat">
                    <span class="value">GIGO</span>
                    <span class="label">Garbage In, Garbage Out</span>
                </div>
                <div class="detail-stat highlight">
                    <span class="value">공정 사회</span>
                    <span class="label">기술적 토대</span>
                </div>
            </div>
            <div class="detail-text">
                <h4>AI의 본질</h4>
                <p>AI는 데이터 과학입니다. <strong>입력 데이터가 거짓이면 결과도 거짓</strong>입니다.</p>
                <h4>공정한 사회의 기반</h4>
                <p>OpenHash + AI 조합은 <strong>정직하게 일한 만큼 정당한 대가</strong>를 받는 사회를 가능하게 합니다. 사기, 편법, 허위가 기술적으로 차단되는 사회, 모든 국민이 능력에 맞는 일자리와 최소한의 경제적 존엄을 누리는 <strong>기본 소득 사회의 기술적 토대</strong>입니다.</p>
            </div>
        `
    }
};

// Verification Section Data
const verifyData = {
    balance: {
        title: '잔액 확인',
        icon: '💰',
        content: `
            <div class="detail-stats">
                <div class="detail-stat"><span class="value">&lt;1ms</span><span class="label">검증 시간</span></div>
                <div class="detail-stat"><span class="value">100%</span><span class="label">정확도</span></div>
            </div>
            <div class="detail-text">
                <h4>검증 내용</h4>
                <p><strong>발신자의 잔액이 거래 금액 이상인지</strong> 확인합니다. 이중 지불 공격을 원천 차단합니다.</p>
            </div>
        `
    },
    identity: {
        title: '신원 확인',
        icon: '🪪',
        content: `
            <div class="detail-stats">
                <div class="detail-stat"><span class="value">SSI</span><span class="label">자기주권 신원</span></div>
                <div class="detail-stat"><span class="value">5요소</span><span class="label">검증 항목</span></div>
            </div>
            <div class="detail-text">
                <h4>검증 내용</h4>
                <p><strong>발신자와 수신자의 신원</strong>을 확인하고, 네트워크에 정상 등록된 사용자인지 검증합니다.</p>
            </div>
        `
    },
    limit: {
        title: '한도 확인',
        icon: '📊',
        content: `
            <div class="detail-stats">
                <div class="detail-stat"><span class="value">100T</span><span class="label">단일 거래 한도</span></div>
                <div class="detail-stat"><span class="value">1,000T</span><span class="label">일일 거래 한도</span></div>
            </div>
            <div class="detail-text">
                <h4>검증 내용</h4>
                <p><strong>단일 거래 한도와 일일 누적 한도</strong>를 확인하여 자금세탁을 방지합니다.</p>
            </div>
        `
    },
    anomaly: {
        title: '이상 탐지',
        icon: '🤖',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight"><span class="value">99.4%</span><span class="label">탐지 정확도</span></div>
                <div class="detail-stat"><span class="value">3중</span><span class="label">AI 앙상블</span></div>
            </div>
            <div class="detail-text">
                <h4>BERT-CNN-LSTM 앙상블</h4>
                <p>세 AI 모델이 거래 패턴을 분석하여 <strong>의심도 점수</strong>를 산출합니다.</p>
            </div>
        `
    },
    compliance: {
        title: '규정 준수',
        icon: '⚖️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat"><span class="value">AML</span><span class="label">자금세탁방지</span></div>
                <div class="detail-stat"><span class="value">CFT</span><span class="label">테러자금조달방지</span></div>
            </div>
            <div class="detail-text">
                <h4>검증 내용</h4>
                <p>국내외 <strong>금융 규정 준수 여부</strong>를 최종 확인합니다. UN/OFAC 제재 목록도 대조합니다.</p>
            </div>
        `
    }
};

// Performance Section Data
const perfData = {
    energy: {
        title: '에너지 효율',
        icon: '⚡',
        content: `
            <div class="detail-stats">
                <div class="detail-stat"><span class="value">121 TWh</span><span class="label">Bitcoin 연간</span></div>
                <div class="detail-stat"><span class="value">~1.8 TWh</span><span class="label">OpenHash 연간</span></div>
                <div class="detail-stat highlight"><span class="value">98.5%</span><span class="label">절감률</span></div>
            </div>
            <div class="detail-text">
                <h4>기술 원리</h4>
                <p>작업증명(PoW) 완전 제거. <strong>SHA-256 해시 체인 + Merkle Tree</strong>만으로 무결성을 보장합니다.</p>
            </div>
        `
    },
    speed: {
        title: '검증 속도',
        icon: '🚀',
        content: `
            <div class="detail-stats">
                <div class="detail-stat"><span class="value">10분</span><span class="label">Bitcoin</span></div>
                <div class="detail-stat"><span class="value">4ms</span><span class="label">OpenHash</span></div>
                <div class="detail-stat highlight"><span class="value">150,000배</span><span class="label">속도 향상</span></div>
            </div>
            <div class="detail-text">
                <h4>기술 원리</h4>
                <p><strong>LPBFT 합의</strong>와 계층적 로컬 처리로 전역 동기화 없이 즉시 검증합니다.</p>
            </div>
        `
    },
    bandwidth: {
        title: '대역폭 효율',
        icon: '📡',
        content: `
            <div class="detail-stats">
                <div class="detail-stat"><span class="value">~128</span><span class="label">거래당 bytes</span></div>
                <div class="detail-stat highlight"><span class="value">90%</span><span class="label">대역폭 절감</span></div>
            </div>
            <div class="detail-text">
                <h4>기술 원리</h4>
                <p>상위 계층에는 <strong>머클 루트(32 bytes)만 전파</strong>합니다. 전체 데이터 복제가 불필요합니다.</p>
            </div>
        `
    },
    infra: {
        title: '인프라 비용',
        icon: '🏗️',
        content: `
            <div class="detail-stats">
                <div class="detail-stat highlight"><span class="value">100%</span><span class="label">인프라 투자 절감</span></div>
                <div class="detail-stat highlight"><span class="value">80-90%</span><span class="label">유지보수 절감</span></div>
            </div>
            <div class="detail-text">
                <h4>기술 원리</h4>
                <p>기존 이동통신망의 <strong>물리적 계층 구조</strong>를 그대로 활용합니다. 별도 전용 네트워크가 불필요합니다.</p>
            </div>
        `
    }
};

// Panel interaction setup
function setupPanel(cardsSelector, panelId, contentId, dataObj) {
    const cards = document.querySelectorAll(cardsSelector);
    const panel = document.getElementById(panelId);
    const content = document.getElementById(contentId);
    if (!panel || !content) return;
    
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
                if (!data) return;
                
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
    setupPanel('#problem-cards .card', 'problem-panel', 'problem-content', problemData);
    setupPanel('#value-cards .card', 'value-panel', 'value-content', valueData);
    setupPanel('#verify-cards .verify-step', 'verify-panel', 'verify-content', verifyData);
    setupPanel('#perf-cards .perf-card', 'perf-panel', 'perf-content', perfData);
});
