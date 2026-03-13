// nav.js - 드롭다운 메뉴 지원 (기술·자동화 하위 메뉴 포함)
(function() {
    'use strict';

    // CSS 스타일 주입 (드롭다운 포함)
    if (!document.getElementById('nav-style')) {
        var style = document.createElement('style');
        style.id = 'nav-style';
        style.textContent = `
            .nav {
                background: #1f2937;
                padding: 0.6rem 0;
                position: sticky;
                top: 0;
                z-index: 1000;
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
                font-size: 1.1rem;
                font-weight: 700;
                color: white;
                text-decoration: none;
            }
            .logo span {
                color: #d4a017;
            }
            .nav-menu {
                display: flex;
                gap: 0.15rem;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .nav-menu li {
                position: relative;
                list-style: none;
            }
            .nav-menu a {
                color: rgba(255,255,255,0.6);
                padding: 0.4rem 0.8rem;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 500;
                text-decoration: none;
                transition: all 0.2s;
                white-space: nowrap;
                display: block;
            }
            .nav-menu a:hover {
                color: white;
                background: rgba(255,255,255,0.08);
            }
            .nav-menu a.active {
                color: white;
                background: #1a3a6e;
            }
            /* 비활성화된 메뉴 스타일 */
            .nav-menu a.disabled {
                color: rgba(255,255,255,0.3);
                background: transparent;
                cursor: default;
                pointer-events: none;
            }
            .nav-menu a.disabled:hover {
                color: rgba(255,255,255,0.3);
                background: transparent;
            }
            .dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                background: #2d3748;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                min-width: 180px;
                display: none;
                flex-direction: column;
                padding: 0.4rem 0;
                margin-top: 0.2rem;
                z-index: 1001;
            }
            .dropdown:hover .dropdown-menu {
                display: flex;
            }
            .dropdown-menu a {
                color: rgba(255,255,255,0.7);
                padding: 0.5rem 1rem;
                font-size: 0.75rem;
                border-radius: 0;
                white-space: nowrap;
            }
            .dropdown-menu a:hover {
                background: #4a5568;
                color: white;
            }
            .dropdown-menu a.active {
                background: #1a3a6e;
                color: white;
            }
            .nav-cta {
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
                background: #d4a017;
                color: #1a1a1a;
                font-weight: 700;
                padding: 0.35rem 0.75rem;
                border-radius: 4px;
                font-size: 0.78rem;
                text-decoration: none;
                transition: background 0.2s, transform 0.15s;
                margin-left: 0.4rem;
                white-space: nowrap;
            }
            .nav-cta:hover {
                background: #e8b828;
                transform: translateY(-1px);
            }
            .nav-cta-arrow {
                font-size: 0.7rem;
                transition: transform 0.2s;
            }
            .nav-cta:hover .nav-cta-arrow {
                transform: translateX(2px);
            }
            @media (max-width: 768px) {
                .nav-inner {
                    flex-direction: column;
                    gap: 0.5rem;
                    padding: 0.5rem;
                }
                .nav-menu {
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .dropdown-menu {
                    position: static;
                    display: none;
                    width: 100%;
                    background: #374151;
                    margin-top: 0.2rem;
                }
                .dropdown:hover .dropdown-menu {
                    display: flex;
                }
            }
        `;
        document.head.appendChild(style);
    }

    var currentPath = window.location.pathname;

    // 메뉴 정의 (사법부 자동화 항목에 disabled 추가)
    var menu = [
        { href: '/', label: '홈' },
        { href: '/law/', label: '사법부 자동화' }, 
        { href: '/openhash/', label: 'Openhash' },
        { href: '/ai/', label: 'A.I' },
        {
            label: '기술',
            href: '/technology/',
            dropdown: [
                { href: '/technology/principle/', label: '원리' },
                { href: '/technology/practical/', label: '실용' },
                { href: '/technology/simulation/', label: '시뮬레이션' },
                { href: '/technology/tests/', label: '테스트' },
                { href: '/technology/decentralization/', label: '탈중앙화' }
            ]
        },
        { href: '/gopang/', label: '고팡' },
        {
            label: '인프라 자동화',
            href: '/automation/',
            dropdown: [
                { href: '/automation/market/', label: '시장' },
                { href: '/automation/employment/', label: '완전 고용' },
                { href: '/automation/currency/', label: '화폐' },
                { href: '/automation/autonomous/', label: '자율 주행' },
                { href: '/automation/medical/', label: '의료' },
                { href: '/automation/court/', label: '법원' },
                { href: '/automation/congress/', label: '의회' },
                { href: '/automation/defense/', label: '국방' },
                { href: '/automation/patent/', label: '특허청' },
                { href: '/automation/tax/', label: '국세청' },
                { href: '/automation/province/', label: '지방 자치' }
            ]
        },
        { href: '/agent-web/', label: '새로운 웹' },
        { href: '/ip/', label: '지적재산권' },
        { href: '/exchange/', label: 'EGCT 거래소' }
    ];

    function renderMenu() {
        var html = '<nav class="nav"><div class="nav-inner">' +
            '<a href="/" class="logo">◆ Open<span>Hash</span></a>' +
            '<ul class="nav-menu">';

        menu.forEach(function(item) {
            if (item.dropdown) {
                var isActive = (item.label === '기술' && currentPath.indexOf('/technology/') === 0) ||
                               (item.label === '인프라 자동화' && currentPath.indexOf('/automation/') === 0);
                html += '<li class="dropdown">';
                html += '<a href="' + item.href + '" class="dropdown-toggle' + (isActive ? ' active' : '') + '">' + item.label + '</a>';
                html += '<div class="dropdown-menu">';
                item.dropdown.forEach(function(subItem) {
                    var isSubActive = currentPath === subItem.href ||
                                     (currentPath.indexOf(subItem.href) === 0 && subItem.href !== '/');
                    html += '<a href="' + subItem.href + '"' + (isSubActive ? ' class="active"' : '') + '>' + subItem.label + '</a>';
                });
                html += '</div></li>';
            } else {
                var isActive = (currentPath === item.href) ||
                    (item.href !== '/' && currentPath.indexOf(item.href) === 0);
                if (item.href === '/' && currentPath !== '/') isActive = false;

                // disabled 처리
                var disabledClass = item.disabled ? ' disabled' : '';
                // disabled 항목은 href를 "#"으로 변경하거나 그대로 둘 수 있으나, 클릭 차단은 CSS pointer-events로 처리
                // href는 그대로 두되, disabled 클래스로 스타일과 pointer-events 적용
                html += '<li><a href="' + item.href + '"' + (isActive ? ' class="active' + disabledClass + '"' : ' class="' + disabledClass + '"') + '>' + item.label + '</a></li>';
            }
        });

        html += '</ul>' +
            '<a href="https://www.gopang.net" target="_blank" rel="noopener" class="nav-cta">고팡 AI 체험 <span class="nav-cta-arrow">→</span></a>' +
            '</div></nav>';
        return html;
    }

    // 기존 nav.nav가 있으면 교체, 없으면 삽입
    var oldNav = document.querySelector('nav.nav');
    if (oldNav) {
        oldNav.outerHTML = renderMenu();
    } else {
        document.body.insertAdjacentHTML('afterbegin', renderMenu());
    }

    // 드롭다운 토글 클릭 이벤트 차단 (href가 "#"인 경우에만) – 현재는 사용하지 않음
    document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });

    // 추가: disabled 항목 클릭 시 아무 동작 안 하도록 (혹시 모를 기본 동작 방지)
    document.querySelectorAll('a.disabled').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
})();