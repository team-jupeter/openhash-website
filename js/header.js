/**
 * OpenHash 공통 헤더 컴포넌트
 * 모든 페이지에서 이 파일을 로드하여 동일한 헤더 사용
 */

(function() {
    const currentPath = window.location.pathname;

    // 메뉴 항목 정의 (순서 재배치 + 신규 메뉴)
    const menuItems = [
        { href: '/', label: '홈' },
        { href: '/principle/', label: '원리' },
        { href: '/decentralization/', label: '탈중앙화' },
        { href: '/agent-web/', label: '새로운 웹' },,
        { href: '/ip/', label: '지적재산권' },
        { href: '/currency/', label: '화폐' },
        { href: '/practical/', label: '실용' },
        { href: '/technology/', label: '기술' },
        { href: '/simulation/', label: '시뮬레이션' },
        { href: '/tests/', label: '테스트' }
    ];

    function isActive(href) {
        if (href === '/') {
            return currentPath === '/' || currentPath === '/index.html';
        }
        return currentPath.startsWith(href) || currentPath === href;
    }

    function generateMenuHtml() {
        return menuItems.map(item => {
            const activeClass = isActive(item.href) ? ' class="active"' : '';
            return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
        }).join('\n                ');
    }

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
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .nav-menu a {
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.85rem;
        transition: all 0.2s;
        white-space: nowrap;
    }
    .nav-menu a:hover {
        color: white;
        background: rgba(255,255,255,0.1);
    }
    .nav-menu a.active {
        color: white;
        background: var(--primary, #6366f1);
    }
    @media (max-width: 900px) {
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

    document.addEventListener('DOMContentLoaded', function() {
        const existingNav = document.querySelector('nav.nav');
        if (existingNav) {
            existingNav.outerHTML = generateHeaderHtml();
        } else {
            document.body.insertAdjacentHTML('afterbegin', generateHeaderHtml());
        }

        if (!document.querySelector('style[data-header]')) {
            document.head.insertAdjacentHTML('beforeend', headerCss);
        }
    });
})();
