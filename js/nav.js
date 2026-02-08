(function() {
    // CSS 주입
    if (!document.getElementById('nav-style')) {
        var style = document.createElement('style');
        style.id = 'nav-style';
        style.textContent = '.nav{background:#1f2937;padding:.6rem 0;position:sticky;top:0;z-index:100}.nav-inner{max-width:960px;margin:0 auto;padding:0 2rem;display:flex;justify-content:space-between;align-items:center}.logo{font-size:1.1rem;font-weight:700;color:white;text-decoration:none}.logo span{color:#d4a017}.nav-menu{display:flex;gap:.15rem;list-style:none}.nav-menu a{color:rgba(255,255,255,.6);padding:.4rem .6rem;border-radius:4px;font-size:.78rem;font-weight:500;text-decoration:none;transition:all .2s;white-space:nowrap}.nav-menu a:hover{color:white;background:rgba(255,255,255,.08)}.nav-menu a.active{color:white;background:#1a3a6e}.nav-cta{display:inline-flex;align-items:center;gap:.3rem;background:#d4a017;color:#1a1a1a;font-weight:700;padding:.35rem .75rem;border-radius:4px;font-size:.78rem;text-decoration:none;transition:background .2s,transform .15s;margin-left:.4rem;white-space:nowrap}.nav-cta:hover{background:#e8b828;transform:translateY(-1px)}.nav-cta-arrow{font-size:.7rem;transition:transform .2s}.nav-cta:hover .nav-cta-arrow{transform:translateX(2px)}';
        document.head.appendChild(style);
    }

    var currentPath = window.location.pathname;
    var menu = [
        { href: '/', label: '홈' },
        { href: '/gopang/', label: '고팡' },
        { href: '/employment/', label: '완전 고용' },
        { href: '/autonomous/', label: '자율 주행' },
        { href: '/technology/', label: '기술' },
        { href: '/automation/', label: '자동화' },
        { href: '/agent-web/', label: '새로운 웹' },
        { href: '/currency/', label: '화폐' }
    ];
    var html = '<nav class="nav"><div class="nav-inner">' +
        '<a href="/" class="logo">◆ Open<span>Hash</span></a>' +
        '<ul class="nav-menu">';
    menu.forEach(function(item) {
        var isActive = (currentPath === item.href) ||
            (item.href !== '/' && currentPath.indexOf(item.href) === 0);
        if (item.href === '/' && currentPath !== '/') isActive = false;
        html += '<li><a href="' + item.href + '"' +
            (isActive ? ' class="active"' : '') + '>' + item.label + '</a></li>';
    });
    html += '</ul>' +
        '<a href="https://www.gopang.net" target="_blank" rel="noopener" class="nav-cta">고팡 AI 체험 <span class="nav-cta-arrow">→</span></a>' +
        '</div></nav>';

    var oldNav = document.querySelector('nav.nav');
    if (oldNav) {
        oldNav.outerHTML = html;
    } else {
        document.body.insertAdjacentHTML('afterbegin', html);
    }
})();