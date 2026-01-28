/**
 * OpenHash 공통 헤더 컴포넌트
 * 모든 페이지에서 이 파일을 로드하여 동일한 헤더 사용
 */

(function() {
    // 현재 페이지 경로 확인
    const currentPath = window.location.pathname;
    
    // 메뉴 항목 정의
    const menuItems = [
        { href: '/', label: '홈' },
        { href: '/test/layer-selection.html', label: '원리' },
        { href: '/currency/', label: '화폐' },
        { href: '/practical/', label: '실용' },
        { href: '/technology/', label: '기술' },
        { href: '/simulation/', label: '시뮬레이션' },
        { href: '/tests/', label: '테스트' }
    ];
    
    // 활성 메뉴 판단
    function isActive(href) {
        if (href === '/') {
            return currentPath === '/' || currentPath === '/index.html';
        }
        return currentPath.startsWith(href) || currentPath === href;
    }
    
    // 기존 메뉴에 "원리", "화폐"가 있는지 확인
    function hasNewMenuItems() {
        const existingNav = document.querySelector('nav.nav .nav-menu');
        if (!existingNav) return false;
        return existingNav.innerHTML.includes('원리') && existingNav.innerHTML.includes('화폐');
    }
    
    // 메뉴 HTML 생성
    function generateMenuHtml() {
        return menuItems.map(item => {
            const activeClass = isActive(item.href) ? ' class="active"' : '';
            return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
        }).join('\n                ');
    }
    
    // 헤더 HTML
    function generateHeaderHtml() {
        return `
    <nav class="nav">
        <div class="nav-inner">
            <a href="/" class="logo">◆ OpenHash</a>
            <ul class="nav-menu">
                ${generateMenuHtml()}
            </ul>
        </div>
    </nav>
    `;
    }
    
    // 헤더 CSS
    const headerCss = `
    <style data-header="true">
    .nav {
        background: var(--gray-800, #1f2937);
        padding: 0.75rem 0;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .nav-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo {
        font-size: 1.25rem;
        font-weight: 700;
        color: white;
        text-decoration: none;
    }
    .nav-menu {
        display: flex;
        gap: 0.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .nav-menu a {
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        transition: all 0.2s;
    }
    .nav-menu a:hover {
        color: white;
        background: rgba(255,255,255,0.1);
    }
    .nav-menu a.active {
        color: white;
        background: var(--primary, #6366f1);
    }
    @media (max-width: 768px) {
        .nav-inner {
            flex-direction: column;
            gap: 1rem;
        }
        .nav-menu {
            flex-wrap: wrap;
            justify-content: center;
        }
    }
    </style>
    `;
    
    // DOM에 삽입
    document.addEventListener('DOMContentLoaded', function() {
        // 이미 올바른 메뉴가 있으면 스킵
        if (hasNewMenuItems()) {
            return;
        }
        
        // 기존 nav 요소가 있으면 교체, 없으면 body 맨 앞에 삽입
        const existingNav = document.querySelector('nav.nav');
        if (existingNav) {
            existingNav.outerHTML = generateHeaderHtml();
        } else {
            document.body.insertAdjacentHTML('afterbegin', generateHeaderHtml());
        }
        
        // CSS가 없으면 추가
        if (!document.querySelector('style[data-header]')) {
            document.head.insertAdjacentHTML('beforeend', headerCss);
        }
    });
})();
