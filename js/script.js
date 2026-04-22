/* =============================================
   Portfolio JS — Theme, Particles, Animations
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {

    // ========== THEME TOGGLE ==========
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');
    if (saved) html.setAttribute('data-theme', saved);

    themeBtn.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateParticleColor();
    });

    // ========== PARTICLE CANVAS ==========
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleColor = getComputedStyle(html).getPropertyValue('--accent').trim();

    function updateParticleColor() {
        setTimeout(() => {
            particleColor = getComputedStyle(html).getPropertyValue('--accent').trim();
        }, 50);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawLines() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = particleColor;
                    ctx.globalAlpha = (1 - dist / 120) * 0.15;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ========== TYPING EFFECT ==========
    const phrases = [
        'Scanning vulnerabilities...',
        'Penetration testing in progress...',
        'Bug bounty hunter active...',
        'Securing the web...',
        'Exploiting OWASP Top 10...',
        'Reporting critical findings...',
    ];
    const typingEl = document.getElementById('typing-text');
    let pIdx = 0, cIdx = 0, deleting = false;

    function typeLoop() {
        const text = phrases[pIdx];
        if (deleting) {
            typingEl.textContent = text.substring(0, cIdx--);
            if (cIdx < 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
            setTimeout(typeLoop, 25);
        } else {
            typingEl.textContent = text.substring(0, cIdx++);
            if (cIdx > text.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
            setTimeout(typeLoop, 60);
        }
    }
    typeLoop();

    // ========== SCROLL PROGRESS ==========
    const prog = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        prog.style.width = pct + '%';
    });

    // ========== NAVBAR SCROLL ==========
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

    // ========== MOBILE MENU ==========
    const mobBtn = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    mobBtn.addEventListener('click', () => {
        mobBtn.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => { mobBtn.classList.remove('active'); navLinks.classList.remove('open'); });
    });

    // ========== SCROLL REVEAL ==========
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

    // ========== COUNTER ANIMATION ==========
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = Math.max(1, Math.floor(target / 50));
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 30);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-value').forEach(el => counterObs.observe(el));

    // ========== CVSS BAR ANIMATION ==========
    const cvssObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); cvssObs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('.cvss-fill').forEach(el => cvssObs.observe(el));

    // ========== ACTIVE NAV LINK ==========
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.id; });
        allNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// ========== FORM HANDLER ==========
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00d4ff, #0284c7)';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
    return false;
}
