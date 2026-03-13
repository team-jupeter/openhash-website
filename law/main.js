// main.js - 동적 로딩 및 이벤트 처리

// 간단한 캐시 (sessionStorage)
const cache = new Map();

async function loadFragment(url) {
    if (cache.has(url)) {
        return cache.get(url);
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const html = await response.text();
    cache.set(url, html);
    return html;
}

// 로딩 인디케이터 표시/제거
function showLoader(container) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<span class="material-icons">hourglass_empty</span> 로딩 중...';
    loader.style.textAlign = 'center';
    loader.style.padding = '40px';
    container.appendChild(loader);
    return loader;
}

// 순차적으로 모든 섹션 로드 (개선: Intersection Observer로 전환 가능)
async function loadAllSections() {
    const headerDiv = document.getElementById('header');
    const footerDiv = document.getElementById('footer');
    const main = document.getElementById('dynamic-content');

    // 로더 표시
    const loader = showLoader(main);

    try {
        // 헤더와 푸터는 항상 먼저 로드
        const headerHtml = await loadFragment('header.html');
        headerDiv.innerHTML = headerHtml;

        const footerHtml = await loadFragment('footer.html');
        footerDiv.innerHTML = footerHtml;

        // 메인 섹션 목록
        const sections = [
            'hero.html',
            'eval-cards.html',
            'guide-panel.html',
            'philosophy-panel.html',
            'feature-grid.html',
            'case-docs.html',
            'patent-docs.html'
        ];

        // 섹션을 순차적으로 삽입 (병렬 로드 후 순서대로 삽입해도 됨)
        for (const file of sections) {
            const html = await loadFragment(file);
            main.insertAdjacentHTML('beforeend', html);
        }

        // 로더 제거
        loader.remove();

        // 모든 동적 요소가 삽입된 후 이벤트 리스너 부착
        attachEventListeners();
    } catch (error) {
        loader.innerHTML = `<span style="color:red;">오류 발생: ${error.message}</span>`;
        console.error(error);
    }
}

// 통계 패널 토글 함수 (전역에서 접근 가능하도록)
window.toggleStatPanel = function(panelId, element) {
    const panel = document.getElementById(panelId);
    // 현재 열린 패널 추적 (간단하게 하나만 열리도록)
    const openPanel = document.querySelector('.slide-panel.open');
    if (openPanel && openPanel !== panel) {
        openPanel.classList.remove('open');
    }
    if (panel) {
        panel.classList.toggle('open');
    }
};

// 동적으로 삽입된 요소에 이벤트 바인딩 (필요시)
function attachEventListeners() {
    // 통계 카드 클릭은 이미 onclick 속성으로 처리되므로 추가 작업 불필요
    // 하지만 동적 삽입 시 onclick이 유지되므로 문제없음.
    // 추가 인터랙션이 필요하면 여기에 작성
}

// 페이지 로드 시 실행
window.addEventListener('load', loadAllSections);

// (선택) 레이지 로딩 구현: Intersection Observer로 화면에 보일 때 로드
// 현재는 모든 섹션을 한 번에 로드하지만, 필요시 아래 코드로 대체 가능
/*
function lazyLoadSections() {
    // 각 섹션을 placeholder로 대체하고, 보일 때 fetch
}
*/
