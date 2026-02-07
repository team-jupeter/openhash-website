(function() {
    // CSS 주입
    if (!document.getElementById('nav-style')) {
        var style = document.createElement('style');
        style.id = 'nav-style';
        style.textContent = '.nav{background:#1f2937;padding:.6rem 0;position:sticky;top:0;z-index:100}.nav-inner{max-width:960px;margin:0 auto;padding:0 2rem;display:flex;justify-content:space-between;align-items:center}.logo{font-size:1.1rem;font-weight:700;color:white;text-decoration:none}.logo span{color:#d4a017}.nav-menu{display:flex;gap:.15rem;list-style:none}.nav-menu a{color:rgba(255,255,255,.6);padding:.4rem .6rem;border-radius:4px;font-size:.78rem;font-weight:500;text-decoration:none;transition:all .2s;white-space:nowrap}.nav-menu a:hover{color:white;background:rgba(255,255,255,.08)}.nav-menu a.active{color:white;background:#1a3a6e}';
        document.head.appendChild(style);
    }

    var currentPath = window.location.pathname;
    var menu = [
        { href: '/', label: '홈' },
        { href: '/gopang/', label: '고팡' },
        { href: '/principle/', label: '원리' },
        { href: '/decentralization/', label: '탈중앙화' },
        { href: '/agent-web/', label: '새로운 웹' },
        { href: '/currency/', label: '화폐' },
        { href: '/practical/', label: '실용' },
        { href: '/technology/', label: '기술' },
        { href: '/simulation/', label: '시뮬레이션' },
        { href: '/tests/', label: '테스트' }
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
    html += '</ul></div></nav>';

    var oldNav = document.querySelector('nav.nav');
    if (oldNav) {
        oldNav.outerHTML = html;
    } else {
        document.body.insertAdjacentHTML('afterbegin', html);
    }
})();
