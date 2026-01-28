/**
 * Verification Cards - Slide Out/In Panel Interaction
 * 5단계 거래 검증 상세 설명
 */

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.verify-step');
    const detailPanel = document.getElementById('verify-detail-panel');
    const detailContent = document.getElementById('verify-detail-content');

    if (!detailPanel || !detailContent) return;

    let activeStep = null;

    const stepDetails = {
        balance: {
            title: '잔액 확인',
            icon: '💰',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">&lt;1ms</span>
                        <span class="stat-label">검증 소요 시간</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">100%</span>
                        <span class="stat-label">정확도</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>검증 내용</h4>
                    <p><strong>발신자의 잔액이 거래 금액 이상인지</strong> 확인합니다. 이중 지불(Double Spending) 공격을 원천 차단하는 첫 번째 관문입니다.</p>
                    <h4>기술 원리</h4>
                    <p>사용자의 <strong>해시 체인</strong>에 기록된 최신 잔액 상태를 조회합니다. 해시 체인은 위변조가 불가능하므로, 잔액 조작 시도는 즉시 탐지됩니다.</p>
                    <p>잔액 부족 시 거래는 <strong>즉시 거부</strong>되며, 이후 단계로 진행되지 않습니다.</p>
                </div>
            `
        },
        identity: {
            title: '신원 확인',
            icon: '🪪',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">SSI</span>
                        <span class="stat-label">자기주권 신원</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">5요소</span>
                        <span class="stat-label">검증 항목</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>검증 내용</h4>
                    <p><strong>발신자와 수신자의 신원</strong>을 확인하고, 양측이 OpenHash 네트워크에 <strong>정상 등록된 사용자</strong>인지 검증합니다.</p>
                    <h4>SSI(자기주권신원) 5요소 검증</h4>
                    <ul style="list-style: none; padding: 0; margin: var(--space-3) 0;">
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--primary);">①</span> 신분증 원본 (해시값)</li>
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--primary);">②</span> 발행자 디지털 서명</li>
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--primary);">③</span> 해시값 (SHA-256)</li>
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--primary);">④</span> 계층/노드 정보</li>
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--primary);">⑤</span> 저장 시각 (타임스탬프)</li>
                    </ul>
                    <p>중앙 기관 없이 사용자가 직접 자신의 신원을 증명하는 <strong>탈중앙화 신원 인증</strong> 방식입니다.</p>
                </div>
            `
        },
        limit: {
            title: '한도 확인',
            icon: '📊',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">100T</span>
                        <span class="stat-label">단일 거래 한도</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">1,000T</span>
                        <span class="stat-label">일일 거래 한도</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>검증 내용</h4>
                    <p><strong>단일 거래 한도</strong>와 <strong>일일 누적 거래 한도</strong>를 초과하는지 확인합니다. 대규모 자금 이동을 통한 자금세탁을 방지합니다.</p>
                    <h4>계층별 한도 정책</h4>
                    <p>거래 규모에 따라 처리되는 계층이 달라집니다:</p>
                    <ul style="list-style: none; padding: 0; margin: var(--space-3) 0;">
                        <li style="padding: 0.4rem 0; font-size: 0.9rem;"><strong>L1 (읍면동):</strong> 소액 거래 (70% 처리)</li>
                        <li style="padding: 0.4rem 0; font-size: 0.9rem;"><strong>L2 (시군구):</strong> 중액 거래</li>
                        <li style="padding: 0.4rem 0; font-size: 0.9rem;"><strong>L3 (광역시도):</strong> 고액 거래</li>
                        <li style="padding: 0.4rem 0; font-size: 0.9rem;"><strong>L4 (국가):</strong> 대규모/국제 거래</li>
                    </ul>
                </div>
            `
        },
        anomaly: {
            title: '이상 탐지',
            icon: '🤖',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat highlight">
                        <span class="stat-value">99.4%</span>
                        <span class="stat-label">탐지 정확도</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">3중</span>
                        <span class="stat-label">AI 앙상블</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>검증 내용</h4>
                    <p><strong>AI 앙상블 모델</strong>이 거래 패턴을 분석하여 <strong>의심도 점수</strong>를 산출합니다. 비정상적인 거래는 추가 검증 대상으로 분류됩니다.</p>
                    <h4>BERT-CNN-LSTM 앙상블</h4>
                    <ul style="list-style: none; padding: 0; margin: var(--space-3) 0;">
                        <li style="padding: 0.4rem 0; font-size: 0.9rem;"><strong>BERT:</strong> 거래 컨텍스트 및 관계 분석</li>
                        <li style="padding: 0.4rem 0; font-size: 0.9rem;"><strong>CNN:</strong> 거래 패턴의 공간적 특징 추출</li>
                        <li style="padding: 0.4rem 0; font-size: 0.9rem;"><strong>LSTM:</strong> 시계열 거래 이력 분석</li>
                    </ul>
                    <p>세 모델의 결과를 종합하여 <strong>99.4% 정확도</strong>로 부정거래를 탐지합니다. 오탐률(False Positive)은 0.1% 미만입니다.</p>
                </div>
            `
        },
        compliance: {
            title: '규정 준수',
            icon: '⚖️',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">AML</span>
                        <span class="stat-label">자금세탁방지</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">CFT</span>
                        <span class="stat-label">테러자금조달방지</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>검증 내용</h4>
                    <p>국내외 <strong>금융 규정 준수 여부</strong>를 최종 확인합니다. 모든 거래는 법적 요건을 충족해야 승인됩니다.</p>
                    <h4>검증 항목</h4>
                    <ul style="list-style: none; padding: 0; margin: var(--space-3) 0;">
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--success);">✓</span> AML(자금세탁방지) 규정</li>
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--success);">✓</span> CFT(테러자금조달방지) 규정</li>
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--success);">✓</span> 국가별 금융 규제 (한국: 특금법)</li>
                        <li style="padding: 0.4rem 0; padding-left: 1.5rem; position: relative; font-size: 0.9rem;"><span style="position: absolute; left: 0; color: var(--success);">✓</span> UN/OFAC 제재 목록 대조</li>
                    </ul>
                    <p>규정 위반 거래는 <strong>즉시 차단</strong>되며, 관련 기관에 자동 보고됩니다.</p>
                </div>
            `
        }
    };

    steps.forEach(step => {
        step.addEventListener('click', () => {
            const stepType = step.dataset.type;

            if (activeStep === step) {
                closePanel();
            } else {
                if (activeStep) {
                    activeStep.classList.remove('active');
                }
                step.classList.add('active');
                activeStep = step;
                showDetail(stepType);
            }
        });
    });

    function showDetail(type) {
        const detail = stepDetails[type];
        if (!detail) return;

        detailContent.innerHTML = `
            <button class="verify-detail-close" id="verify-detail-close-inner">
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

        const innerClose = document.getElementById('verify-detail-close-inner');
        if (innerClose) {
            innerClose.addEventListener('click', closePanel);
        }

        detailPanel.classList.add('open');
    }

    function closePanel() {
        detailPanel.classList.remove('open');
        if (activeStep) {
            activeStep.classList.remove('active');
            activeStep = null;
        }
    }
});
