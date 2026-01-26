document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 스크롤 효과
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 숫자 카운트업 애니메이션
    const observerOptions = { threshold: 0.5 };
    const countObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const duration = 2000;
                const start = performance.now();
                
                function update(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = target * easeOut;
                    
                    if (target % 1 !== 0) {
                        el.textContent = current.toFixed(1);
                    } else {
                        el.textContent = Math.floor(current).toLocaleString();
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }
                requestAnimationFrame(update);
                countObserver.unobserve(el);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-target]').forEach(function(el) {
        countObserver.observe(el);
    });

    // 섹션 페이드인 애니메이션
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(function(el) {
        fadeObserver.observe(el);
    });

    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
});
