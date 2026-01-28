/**
 * Value Cards - OpenHash 미래 가치 섹션
 * Slide Out/In Panel Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.value-card');
    const detailPanel = document.getElementById('value-detail-panel');
    const detailContent = document.getElementById('value-detail-content');
    const closeBtn = document.getElementById('value-detail-close');

    if (!detailPanel || !detailContent) return;

    let activeCard = null;

    const cardDetails = {
        economic: {
            title: '경제적 효용',
            icon: '💰',
            content: `
                <div class="detail-text">
                    <p>대개의 사람들이 그 중요성을 과소 평가하지만, 모든 데이터에 대해 그 <strong>참(True)인 정도를 평가</strong>할 수 있고, 기록 시점 이후로 <strong>위변조되지 않았음을 기술적으로 증명</strong>할 수 있는 기술의 경제적 효용은 AI 기술 만큼이나 파급력이 큰 인류 문명사의 전환점입니다.</p>
                    <h4>AI 시대의 데이터 주체 변화</h4>
                    <p>향후, 인간의 육체 노동은 로봇이 대체하고, 지적 노동은 AI가 대체할 것입니다. 현대 문명은 사람을 데이터 생산의 주체이자 소비의 주체로 상정합니다.</p>
                    <p>가령, 주민등록증이나 운전면허증, 졸업증명서, 성적증명서, 진단서, 등기부등본 등 <strong>수천 종 문서의 생산과 소비자는 모두 사람</strong>입니다.</p>
                    <h4>AI Agent의 등장</h4>
                    <p>AI 시대에 이 문서들의 생산자와 소비자는 모두 <strong>AI 혹은 AI Agent</strong>입니다. OpenHash는 AI가 이들 문서의 진위를 판단할 <strong>유일한 해법</strong>입니다.</p>
                    <p>이 말이 선뜻 이해되지 않을 것입니다. 가령, 진단서가 진짜인지, 발급 이후로 정교하게 위변조되지 않았는지 AI가 어떻게 판단할 수 있을까요?</p>
                </div>
            `
        },
        worth: {
            title: '기술의 가치',
            icon: '🏆',
            content: `
                <div class="detail-stats">
                    <div class="detail-stat">
                        <span class="stat-value">500조</span>
                        <span class="stat-label">ChatGPT 추정 (최대)</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">300조</span>
                        <span class="stat-label">Claude 추정 (최대)</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">10,000조</span>
                        <span class="stat-label">Gemini 추정 (최대)</span>
                    </div>
                    <div class="detail-stat">
                        <span class="stat-value">1,500조</span>
                        <span class="stat-label">DeepSeek 추정 (최대)</span>
                    </div>
                </div>
                <div class="detail-text">
                    <h4>AI 모델의 평가</h4>
                    <p>주요 AI 모델이 추정한 OpenHash 기술의 효용 혹은 가치는 <strong>최소 수십 조원에서 최대 수천 조원</strong>에 이릅니다.</p>
                    <h4>평가 프롬프트</h4>
                    <p style="background: var(--gray-100); padding: 1rem; border-radius: 6px; font-size: 0.9rem; font-style: italic;">"국가와 사회의 모든 영역에 첨부한 문서의 OpenHash 기술을 전면적이고, 포괄적으로 적용하는 경우를 상정하여, 객관적이고 보수적인 관점에서 OpenHash 기술의 경제적 가치를 평가하십시오."</p>
                </div>
            `
        },
        rebirth: {
            title: '재조산하(再造山河)',
            icon: '🇰🇷',
            content: `
                <div class="detail-text">
                    <h4>대한민국의 기회</h4>
                    <p>OpenHash 기술은 AI 기술과 더불어, 우리 사회를 <strong>탈바꿈할 원천 기술</strong>입니다.</p>
                    <p>AI 기술의 시작과 선두는 서구와 중국이지만, <strong>OpenHash 기술은 한국이 유일</strong>합니다.</p>
                    <h4>한국이 최적지인 이유</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: var(--primary);">✓</span> 세계 최고 수준의 <strong>통신 인프라</strong></li>
                        <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: var(--primary);">✓</span> 신기술에 대한 국민적 저항 강도가 일본 등 여타 국가보다 <strong>현저히 낮음</strong></li>
                        <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: var(--primary);">✓</span> <strong>세계 10위권</strong>의 경제 규모</li>
                        <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: var(--primary);">✓</span> 반도체 등 <strong>기반 기술</strong> 보유</li>
                    </ul>
                    <p style="margin-top: 1rem;">AI와 OpenHash를 전면 적용할 <strong>최적의 국가</strong>는 대한민국입니다.</p>
                </div>
            `
        },
        fairness: {
            title: '기본 소득과 공정한 사회',
            icon: '⚖️',
            content: `
                <div class="detail-text">
                    <h4>Garbage In, Garbage Out</h4>
                    <p>AI는 데이터 과학이며, 모든 데이터 기술의 공통점은 <strong>Garbage in, Garbage out</strong>입니다.</p>
                    <p>아무리 뛰어난 성능을 갖춘 AI라도 그 입력 데이터가 오염되었으면, 그 결과도 쓰레기일 뿐입니다.</p>
                    <h4>OpenHash와 AI의 시너지</h4>
                    <p><strong>OpenHash와 AI는 불가분</strong>이며, 이 둘의 효용은 새로운 미래상을 제시합니다.</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: var(--success);">✓</span> 성실히 일하는 모두가 경제적으로 <strong>정당한 대가</strong>를 누림</li>
                        <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: var(--error);">✗</span> 편법과 탈법, 꼼수와 잔꾀로 <strong>부당한 이익의 기회를 온전히 제거</strong></li>
                    </ul>
                    <h4>기술적 토대</h4>
                    <p>AI는 데이터를 가공하는 기술이며, OpenHash는 그 입력 데이터가 <strong>참(True)임을 입증</strong>하는 기술입니다.</p>
                    <p>모든 시민이 자신의 능력과 적성에 맞는 일자리를 제공받고, 모두가 최소한의 경제적 존엄을 누리는 <strong>기본 소득 사회를 구현할 기술적 토대</strong>입니다.</p>
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

    if (closeBtn) {
        closeBtn.addEventListener('click', closePanel);
    }

    function showDetail(type) {
        const detail = cardDetails[type];
        if (!detail) return;

        detailContent.innerHTML = `
            <button class="value-detail-close" id="value-detail-close-inner">
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

        const innerClose = document.getElementById('value-detail-close-inner');
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
