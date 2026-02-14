// automation-nav.js - OpenHash 자동화 섹션 전용 탭 네비게이션 생성기
(function() {
    'use strict';

    // ----- 자동화 탭 설정 -----
    const AUTOMATION_TABS = [
        { name: '의료', path: 'medical/' },
        { name: '특허청', path: 'patent/' },
        { name: '국세청', path: 'tax/' },
        { name: '법원', path: 'court/' },
        { name: '의회', path: 'parliament/' },
        { name: '도청', path: 'province/' },
        { name: '시청', path: 'city/' },
        { name: '읍면동사무소', path: 'town/' }
    ];

    const BASE_PATH = '/automation/';
    const CONTAINER_ID = 'automation-tab-container';  // 각 페이지에 삽입할 컨테이너 ID

    // ----- 탭 HTML 생성 -----
    function renderTabs() {
        const currentPath = window.location.pathname;
        let html = '<div class="tab-nav">';

        AUTOMATION_TABS.forEach(tab => {
            const fullPath = BASE_PATH + tab.path;
            // 현재 경로와 탭 경로가 정확히 일치하는지 확인
            const isActive = currentPath === fullPath;
            const activeClass = isActive ? ' active' : '';
            html += `<a href="${fullPath}" class="tab-link${activeClass}">${tab.name}</a>`;
        });

        html += '</div>';
        return html;
    }

    // ----- DOM에 삽입 -----
    function injectNavigation() {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) {
            // 디버깅용: 컨테이너가 없으면 경고 (선택사항)
            // console.warn(`automation-nav.js: #${CONTAINER_ID}를 찾을 수 없습니다.`);
            return;
        }

        // 중복 삽입 방지
        if (container.querySelector('.tab-nav')) return;

        container.innerHTML = renderTabs();
    }

    // ----- 실행 -----
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNavigation);
    } else {
        injectNavigation();
    }
})();
