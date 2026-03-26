/* =============================================
   PARTICLES BACKGROUND
   ============================================= */
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles, animId;
    const COUNT = 55;
    const MAX_DIST = 140;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function getColor() {
        const isDark = document.body.classList.contains('dark-theme');
        return isDark ? '100, 220, 200' : '32, 178, 160';
    }

    function Particle() {
        this.reset();
    }
    Particle.prototype.reset = function () {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 2 + 1;
    };
    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    };

    function createParticles() {
        particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const color = getColor();
        particles.forEach(p => {
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, 0.7)`;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const alpha = 1 - dist / MAX_DIST;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${color}, ${alpha * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        resize();
        createParticles();
        draw();
    });
})();


/* =============================================
   TYPING EFFECT
   ============================================= */
(function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;
    const texts = ['IT Student', 'Web Developer', 'Problem Solver', 'Lifelong Learner'];
    let textIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = texts[textIdx];
        if (isDeleting) {
            el.textContent = current.slice(0, --charIdx);
        } else {
            el.textContent = current.slice(0, ++charIdx);
        }

        let delay = isDeleting ? 60 : 110;

        if (!isDeleting && charIdx === current.length) {
            delay = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            textIdx = (textIdx + 1) % texts.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 900);
})();


/* =============================================
   ANIMATED COUNTERS
   ============================================= */
(function initCounters() {
    const groups = document.querySelectorAll('.profile__info-group[data-count]');
    if (!groups.length) return;

    function animateCounter(el, target, suffix) {
        const duration = 1800;
        const start = performance.now();
        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const group = entry.target;
                const numEl = group.querySelector('.counter-number');
                const target = parseInt(group.dataset.count, 10);
                const suffix = group.dataset.suffix || '';
                animateCounter(numEl, target, suffix);
                observer.unobserve(group);
            }
        });
    }, { threshold: 0.5 });

    groups.forEach(g => observer.observe(g));
})();


/* =============================================
   SKILL BAR ANIMATIONS
   ============================================= */
(function initSkillBars() {
    function animateBars() {
        document.querySelectorAll('.skills__bar-fill').forEach(bar => {
            const w = bar.dataset.width;
            if (w) bar.style.width = w + '%';
        });
    }

    // Trigger when skills tab becomes visible
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateBars();
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });

    const skillsContent = document.getElementById('skills-tab');
    if (skillsContent) observer.observe(skillsContent);

    // Also trigger on tab click
    document.querySelectorAll('[data-target="#skills-tab"]').forEach(btn => {
        btn.addEventListener('click', () => setTimeout(animateBars, 100));
    });
})();


/* =============================================
   FILTER TABS
   ============================================= */
(function initTabs() {
    const tabs = document.querySelectorAll('[data-target]');
    const tabContents = document.querySelectorAll('[data-content]');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.target);
            if (!target) return;

            tabContents.forEach(tc => tc.classList.remove('filters__active'));
            target.classList.add('filters__active');

            tabs.forEach(t => t.classList.remove('filter-tab-active'));
            tab.classList.add('filter-tab-active');
        });
    });
})();


/* =============================================
   DARK / LIGHT THEME
   ============================================= */
(function initTheme() {
    const themeButton = document.getElementById('theme-button');
    if (!themeButton) return;

    const darkTheme = 'dark-theme';
    const iconDark = 'ri-moon-line';
    const iconLight = 'ri-sun-line';

    const saved = localStorage.getItem('selected-theme');
    const savedIcon = localStorage.getItem('selected-icon');

    if (saved === 'dark') {
        document.body.classList.add(darkTheme);
        themeButton.classList.remove(iconDark);
        themeButton.classList.add(iconLight);
    }

    themeButton.addEventListener('click', () => {
        const isDark = document.body.classList.toggle(darkTheme);
        themeButton.classList.toggle(iconLight, isDark);
        themeButton.classList.toggle(iconDark, !isDark);
        localStorage.setItem('selected-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('selected-icon', isDark ? iconLight : iconDark);
    });
})();


/* =============================================
   NAVBAR — scroll spy + sticky shadow + mobile toggle
   ============================================= */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbar-toggle');
    const links = document.getElementById('navbar-links');
    const navLinks = document.querySelectorAll('.navbar__link');

    // Sticky shadow on scroll
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.querySelector('i').className = open ? 'ri-close-line' : 'ri-menu-3-line';
            toggle.setAttribute('aria-expanded', open);
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.querySelector('i').className = 'ri-menu-3-line';
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', e => {
            if (!navbar.contains(e.target)) {
                links.classList.remove('open');
                toggle.querySelector('i').className = 'ri-menu-3-line';
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Scroll spy — active link based on section in view
    const sections = document.querySelectorAll('section[id], header[id]');
    const spyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active-link', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => spyObserver.observe(s));
})();


/* =============================================
   SCROLL-TO-TOP BUTTON
   ============================================= */
(function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


/* =============================================
   CONTACT FORM VALIDATION
   ============================================= */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput   = document.getElementById('contact-name');
    const emailInput  = document.getElementById('contact-email');
    const msgInput    = document.getElementById('contact-message');
    const nameError   = document.getElementById('name-error');
    const emailError  = document.getElementById('email-error');
    const msgError    = document.getElementById('message-error');
    const successMsg  = document.getElementById('form-success');
    const submitBtn   = document.getElementById('contact-submit');

    function validate(input, errorEl, testFn, msg) {
        const ok = testFn(input.value.trim());
        errorEl.textContent = ok ? '' : msg;
        input.classList.toggle('input-error', !ok);
        return ok;
    }

    function isNotEmpty(v) { return v.length > 0; }
    function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function isLongEnough(v) { return v.length >= 10; }

    // Live validation on blur
    nameInput.addEventListener('blur', () =>
        validate(nameInput, nameError, isNotEmpty, 'Please enter your name.'));
    emailInput.addEventListener('blur', () =>
        validate(emailInput, emailError, isValidEmail, 'Enter a valid email address.'));
    msgInput.addEventListener('blur', () =>
        validate(msgInput, msgError, isLongEnough, 'Message must be at least 10 characters.'));

    // Clear error on input
    [nameInput, emailInput, msgInput].forEach(inp => {
        inp.addEventListener('input', () => {
            inp.classList.remove('input-error');
        });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const ok1 = validate(nameInput,  nameError,  isNotEmpty,    'Please enter your name.');
        const ok2 = validate(emailInput, emailError, isValidEmail,  'Enter a valid email address.');
        const ok3 = validate(msgInput,   msgError,   isLongEnough,  'Message must be at least 10 characters.');

        if (!ok1 || !ok2 || !ok3) return;

        // Simulate send (no backend)
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending…';

        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="ri-send-plane-line"></i> Send Message';
            successMsg.classList.add('visible');
            setTimeout(() => successMsg.classList.remove('visible'), 4000);
        }, 1400);
    });
})();


/* =============================================
   SCROLL REVEAL
   ============================================= */
(function initScrollReveal() {
    if (typeof ScrollReveal === 'undefined') return;

    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '40px',
        duration: 900,
        delay: 200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        reset: false,
    });

    sr.reveal('.profile__border',      { origin: 'top', delay: 300 });
    sr.reveal('.profile__name',        { delay: 400 });
    sr.reveal('.profile__profession',  { delay: 500 });
    sr.reveal('.profile__social',      { delay: 600 });
    sr.reveal('.profile__info-group',  { delay: 400, interval: 120 });
    sr.reveal('.profile__buttons',     { delay: 700 });
    sr.reveal('.section__title',       { delay: 200 });
    sr.reveal('.section__subtitle',    { delay: 300 });
    sr.reveal('.filters__content',     { delay: 350 });
    sr.reveal('.skills__area',         { delay: 300 });
    sr.reveal('.contact__card',        { interval: 120, delay: 300 });
    sr.reveal('.contact__form',        { origin: 'right', delay: 400 });
})();


/* =============================================
   PORTFOLIO LOADER — edit assets/data/projects.json to add/remove projects
   ============================================= */
(function initPortfolio() {
    const container = document.getElementById('projects-tab');
    if (!container) return;

    fetch('assets/data/projects.json')
        .then(res => res.json())
        .then(projects => {
            projects.forEach(p => {
                const card = document.createElement('article');
                card.className = 'projects__card';
                card.tabIndex = 0;
                card.innerHTML =
                    '<img src="' + p.image + '" alt="' + p.title + ' project thumbnail" class="projects__img" loading="lazy">' +
                    '<div class="projects__modal"><div>' +
                        '<span class="projects__subtitle">' + p.subtitle + '</span>' +
                        '<h3 class="projects__title">' + p.title + '</h3>' +
                        '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.25rem;">' +
                            '<a href="' + p.gallery + '" class="projects__button" aria-label="View ' + p.title + ' gallery">' +
                                '<i class="ri-gallery-line"></i> Gallery' +
                            '</a>' +
                            '<a href="' + p.github + '" target="_blank" rel="noopener noreferrer" class="projects__button" style="background:transparent;border:1.5px solid rgba(255,255,255,0.5);" aria-label="View ' + p.title + ' on GitHub">' +
                                '<i class="ri-github-line"></i> GitHub' +
                            '</a>' +
                        '</div>' +
                    '</div></div>';
                container.appendChild(card);
            });

            // Re-run ScrollReveal on dynamically added cards
            if (typeof ScrollReveal !== 'undefined') {
                ScrollReveal().reveal('.projects__card', { interval: 100, delay: 300 });
            }
        })
        .catch(() => {
            container.innerHTML = '<p style="color:var(--text-color-light)">Could not load projects.</p>';
        });
})();
