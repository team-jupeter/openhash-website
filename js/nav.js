

// nav.js - menu.html을 로드하고 활성화 처리
(function() {
    'use strict';

    // CSS 스타일 주입 (드롭다운 포함) - 기존과 동일
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

    // 현재 경로
    var currentPath = window.location.pathname;

    /**
     * 메뉴 HTML을 로드하고 활성화 처리
     */
    async function loadMenu() {
        // 플레이스홀더 찾기 (없으면 하드코딩된 nav가 있다고 가정)
        var placeholder = document.getElementById('main-nav-placeholder');
        if (!placeholder) {
            // 플레이스홀더가 없으면 이미 nav가 존재할 수 있으므로 활성화만 수행
            setActiveMenuItem();
            return;
        }

        try {
            var response = await fetch('/menu.html');
            if (!response.ok) throw new Error('메뉴 로딩 실패');
            var html = await response.text();
            placeholder.innerHTML = html;
            setActiveMenuItem(); // 활성화 처리
            // 드롭다운 토글 클릭 차단
            document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
                toggle.addEventListener('click', function(e) { e.preventDefault(); });
            });
        } catch (error) {
            console.error('메뉴 로딩 오류:', error);
            placeholder.innerHTML = '<nav class="nav"><div class="nav-inner">메뉴를 불러올 수 없습니다.</div></nav>';
        }
    }

    /**
     * 현재 경로에 맞게 활성 메뉴 항목 표시
     */
    function setActiveMenuItem() {
        // 모든 nav-menu a 태그
        var links = document.querySelectorAll('.nav-menu a');
        links.forEach(function(link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (!href || href === '#') return;

            // 정확히 일치하거나, 서브경로인 경우 (단, 루트 제외)
            if (href === '/' && currentPath === '/') {
                link.classList.add('active');
            } else if (href !== '/' && currentPath.indexOf(href) === 0) {
                link.classList.add('active');
            }
        });
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadMenu);
    } else {
        loadMenu();
    }
})();

