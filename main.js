/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  JAYAPRAKASH K — THE AURA ENGINE v6.0 (Performance Optimized)       ║
   ║  "No one in the world can replicate this."                          ║
   ║                                                                      ║
   ║  Systems: CSS Aura Background • Morphing Blobs • Click Ripples      ║
   ║  Liquid Text • Magnetic UI • 3D Tilt • Scroll Cinematic • Parallax  ║
   ╚══════════════════════════════════════════════════════════════════════╝ */

// ═══════════════════════════════════════════
// 0. UTILITY — THROTTLE & LERP
// ═══════════════════════════════════════════
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const rand = (min, max) => Math.random() * (max - min) + min;
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

// ═══════════════════════════════════════════
// IV. CLICK RIPPLE EFFECT
// ═══════════════════════════════════════════
class ClickRipple {
    constructor() {
        this.ripples = [];
        document.addEventListener('click', (e) => this.createRipple(e.clientX, e.clientY));
        this.animate();
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);

        // Create multiple rings
        for (let i = 0; i < 3; i++) {
            const ring = document.createElement('div');
            ring.className = 'ripple-ring';
            ring.style.animationDelay = (i * 0.12) + 's';
            ripple.appendChild(ring);
        }

        // Spawn sparkle particles
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.className = 'ripple-spark';
            const angle = (Math.PI * 2 / 8) * i;
            const distance = rand(30, 80);
            spark.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            spark.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            spark.style.animationDelay = rand(0, 0.15) + 's';
            ripple.appendChild(spark);
        }

        setTimeout(() => ripple.remove(), 1200);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════
// VII. DNA HELIX LOADER
// ═══════════════════════════════════════════
class CinematicLoader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.progressBar = document.querySelector('.loader-progress-bar');
        this.percentText = document.querySelector('.loader-percent');
        if (!this.loader) return;
        this.progress = 0;
        this.init();
    }

    init() {
        document.body.style.overflow = 'hidden';

        const interval = setInterval(() => {
            this.progress += Math.random() * 12 + 3;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 600);
            }
            if (this.progressBar) this.progressBar.style.width = this.progress + '%';
            if (this.percentText) this.percentText.textContent = Math.floor(this.progress) + '%';
        }, 120);
    }

    hide() {
        this.loader.classList.add('loaded');
        document.body.style.overflow = '';
        setTimeout(() => {
            this.loader.style.display = 'none';
        }, 1500);
    }
}

// ═══════════════════════════════════════════
// VIII. NAVIGATION
// ═══════════════════════════════════════════
class Navigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.toggle = document.getElementById('menuToggle');
        this.menu = document.getElementById('dimensionalMenu');
        this.init();
    }

    init() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            if (!this.nav) return;
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            // Hide/show nav on scroll direction
            if (currentScroll > lastScroll && currentScroll > 200) {
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                this.nav.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        });

        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', () => {
                this.toggle.classList.toggle('active');
                this.menu.classList.toggle('open');
                document.body.style.overflow = this.menu.classList.contains('open') ? 'hidden' : '';
            });

            this.menu.querySelectorAll('.dimension-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.toggle.classList.remove('active');
                    this.menu.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });
        }
    }
}

// ═══════════════════════════════════════════
// IX. SCROLL PROGRESS BAR
// ═══════════════════════════════════════════
class ScrollProgress {
    constructor() {
        this.bar = document.querySelector('.scroll-progress-bar');
        if (!this.bar) return;
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / scrollHeight) * 100;
            this.bar.style.width = progress + '%';
        });
    }
}

// ═══════════════════════════════════════════
// X. SCROLL CINEMATIC REVEAL
// ═══════════════════════════════════════════
class ScrollCinematic {
    constructor() {
        // Observer for general elements
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

        const targets = document.querySelectorAll(
            '.section-header, .interest-card, .featured-item, .project-card, ' +
            '.skill-category-block, .edu-item, .cert-card-item, .skill-bar-item, ' +
            '.contact-form-wrap, .info-card, .social-cards'
        );
        targets.forEach(el => revealObserver.observe(el));

        // Parallax scroll effect for sections
        this.initParallaxSections();
    }

    initParallaxSections() {
        const sections = document.querySelectorAll('.about-section, .featured-section, .contact-section');
        
        window.addEventListener('scroll', () => {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const clampedProgress = clamp(progress, 0, 1);
                
                // Subtle parallax on section backgrounds
                const header = section.querySelector('.section-header');
                if (header) {
                    header.style.transform = `translateY(${(1 - clampedProgress) * -20}px)`;
                    if (clampedProgress > 0.1) header.classList.add('visible');
                }
            });
        });
    }
}

// ═══════════════════════════════════════════
// XI. 3D TILT EFFECT (Enhanced with Lighting)
// ═══════════════════════════════════════════
class TiltEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-tilt]');
        this.elements.forEach(el => this.addTilt(el));
    }

    addTilt(el) {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

            // Dynamic light reflection
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            el.style.setProperty('--light-x', xPercent + '%');
            el.style.setProperty('--light-y', yPercent + '%');
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            el.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.15s ease-out';
        });
    }
}

// ═══════════════════════════════════════════
// XII. MAGNETIC BUTTONS (Enhanced)
// ═══════════════════════════════════════════
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('[data-magnetic]');
        this.buttons.forEach(btn => this.addMagnetic(btn));
    }

    addMagnetic(btn) {
        let animFrame;
        btn.addEventListener('mousemove', (e) => {
            cancelAnimationFrame(animFrame);
            animFrame = requestAnimationFrame(() => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
                
                // Move inner text opposite direction for depth
                const inner = btn.querySelector('.btn-text');
                if (inner) {
                    inner.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                }
            });
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            const inner = btn.querySelector('.btn-text');
            if (inner) {
                inner.style.transform = 'translate(0, 0)';
                inner.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'transform 0.15s ease-out';
            const inner = btn.querySelector('.btn-text');
            if (inner) inner.style.transition = 'transform 0.15s ease-out';
        });
    }
}

// ═══════════════════════════════════════════
// XIII. LIQUID TEXT SCRAMBLE (Enhanced)
// ═══════════════════════════════════════════
class TextScramble {
    constructor() {
        this.chars = '!<>-_\\/[]{}—=+*^?#◆◇○●□■△▽▷◁';
        this.elements = document.querySelectorAll('.scramble-text');
        this.elements.forEach(el => this.addScramble(el));
    }

    addScramble(el) {
        const original = el.textContent;
        
        el.addEventListener('mouseenter', () => {
            let iteration = 0;
            const interval = setInterval(() => {
                el.textContent = original.split('').map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iteration) return original[index];
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                }).join('');
                
                if (iteration >= original.length) clearInterval(interval);
                iteration += 1 / 2;
            }, 25);
        });
    }
}

// ═══════════════════════════════════════════
// XIV. COUNTER ANIMATION
// ═══════════════════════════════════════════
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2500;
        const start = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            // Elastic ease out for dramatic effect
            const eased = 1 - Math.pow(1 - progress, 5);
            el.textContent = Math.floor(target * eased);
            
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }
}

// ═══════════════════════════════════════════
// XV. SKILL BAR ANIMATOR
// ═══════════════════════════════════════════
class SkillBarAnimator {
    constructor() {
        const bars = document.querySelectorAll('.skill-bar-item');
        if (bars.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const fill = entry.target.querySelector('.skill-bar-fill');
                    const pct = entry.target.dataset.level;
                    if (fill && pct) {
                        setTimeout(() => {
                            fill.style.width = pct + '%';
                        }, 300);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach(bar => observer.observe(bar));
    }
}

// ═══════════════════════════════════════════
// XVI. SMOOTH SCROLL
// ═══════════════════════════════════════════
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// ═══════════════════════════════════════════
// XVII. PARALLAX DEPTH LAYERS (Mouse-driven)
// ═══════════════════════════════════════════
class ParallaxLayers {
    constructor() {
        this.layers = document.querySelectorAll('.hero-depth-layer');
        if (this.layers.length === 0) return;
        this.mouse = { x: 0, y: 0 };
        this.smooth = { x: 0, y: 0 };

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        this.animate();
    }

    animate() {
        this.smooth.x = lerp(this.smooth.x, this.mouse.x, 0.05);
        this.smooth.y = lerp(this.smooth.y, this.mouse.y, 0.05);

        this.layers.forEach((layer, i) => {
            const depth = (i + 1) * 15;
            layer.style.transform = `translate(${this.smooth.x * depth}px, ${this.smooth.y * depth}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════
// XVIII. HOLOGRAPHIC CARD (Enhanced with refraction)
// ═══════════════════════════════════════════
class HoloCardEffect {
    constructor() {
        this.card = document.getElementById('holoCard');
        if (!this.card) return;

        const shine = this.card.querySelector('.holo-shine');
        const rainbow = this.card.querySelector('.holo-rainbow');

        this.card.addEventListener('mousemove', (e) => {
            const rect = this.card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            if (shine) {
                shine.style.background = `
                    radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.2) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(99,102,241,0.1) 0%, transparent 50%)
                `;
            }

            if (rainbow) {
                const angle = 125 + (x - 50) * 0.8;
                rainbow.style.background = `
                    linear-gradient(${angle}deg,
                        rgba(99,102,241,0) 0%,
                        rgba(99,102,241,${0.12 + (x/100)*0.12}) 15%,
                        rgba(139,92,246,${0.12 + (y/100)*0.12}) 25%,
                        rgba(236,72,153,0.12) 35%,
                        rgba(6,182,212,${0.18 - (x/100)*0.12}) 45%,
                        rgba(16,185,129,0.12) 55%,
                        rgba(245,158,11,0.12) 65%,
                        rgba(244,63,94,0.08) 80%,
                        rgba(99,102,241,0) 100%
                    )`;
            }
        });
    }
}

// ═══════════════════════════════════════════
// XIX. GLITCH EFFECT (Random cinematic glitch)
// ═══════════════════════════════════════════
class GlitchEffect {
    constructor() {
        const titles = document.querySelectorAll('.section-title, .page-hero-title, .hero-title');
        titles.forEach(title => {
            setInterval(() => {
                if (Math.random() > 0.93) {
                    const intensity = rand(1, 5);
                    title.style.textShadow = `
                        ${rand(-intensity, intensity)}px 0 rgba(99,102,241,0.8),
                        ${rand(-intensity, intensity)}px 0 rgba(236,72,153,0.8),
                        0 ${rand(-2, 2)}px rgba(6,182,212,0.5)
                    `;
                    title.style.transform = `translateX(${rand(-2, 2)}px)`;
                    setTimeout(() => {
                        title.style.textShadow = 'none';
                        title.style.transform = 'translateX(0)';
                    }, 80 + rand(0, 100));
                }
            }, 1500);
        });
    }
}

// ═══════════════════════════════════════════
// XX. CARD SPOTLIGHT EFFECT (Mouse-reactive lighting)
// ═══════════════════════════════════════════
class CardSpotlight {
    constructor() {
        const cards = document.querySelectorAll('.glass-card, .featured-item, .project-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--spotlight-x', x + 'px');
                card.style.setProperty('--spotlight-y', y + 'px');
            });
        });
    }
}

// ═══════════════════════════════════════════
// XXI. FORM HANDLER
// ═══════════════════════════════════════════
class FormHandler {
    constructor() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            const btn = form.querySelector('.submit-btn');
            if (btn) {
                const btnText = btn.querySelector('.btn-text');
                if (btnText) {
                    btnText.textContent = 'TRANSMITTING...';
                    btn.style.pointerEvents = 'none';
                    
                    // Animate button
                    btn.style.background = 'rgba(99,102,241,0.2)';
                    const pulse = setInterval(() => {
                        btn.style.boxShadow = `0 0 ${rand(10, 30)}px rgba(99,102,241,0.3)`;
                    }, 100);
                    
                    setTimeout(() => clearInterval(pulse), 5000);
                }
            }
        });
    }
}

// ═══════════════════════════════════════════
// XXII. MORPHING TEXT (Hero title text morphs)
// ═══════════════════════════════════════════
class MorphingText {
    constructor() {
        const subtitles = document.querySelectorAll('.scramble-text');
        if (subtitles.length === 0) return;

        // Create liquid underline effect on role texts
        subtitles.forEach(el => {
            const underline = document.createElement('span');
            underline.className = 'liquid-underline';
            el.style.position = 'relative';
            el.appendChild(underline);
        });
    }
}

// ═══════════════════════════════════════════
// XXIII. SECTION TRANSITION WIPE
// ═══════════════════════════════════════════
class SectionWipe {
    constructor() {
        const sections = document.querySelectorAll('.about-section, .featured-section, .contact-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-revealed');
                }
            });
        }, { threshold: 0.05 });

        sections.forEach(section => observer.observe(section));
    }
}

// ═══════════════════════════════════════════
// XXV. INITIALIZE THE AURA ENGINE
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';

    // ── Core Systems ──
    new CinematicLoader();
    new Navigation();
    new ScrollProgress();

    // ── Unique Visual Systems ──
    new ClickRipple();

    // ── Scroll & Animation Systems ──
    new ScrollCinematic();
    new SectionWipe();
    new SmoothScroll();
    new ParallaxLayers();

    // ── Interactive Effects ──
    new TiltEffect();
    new MagneticButtons();
    new HoloCardEffect();
    new CardSpotlight();
    new GlitchEffect();

    // ── Text & Data Effects ──
    new TextScramble();
    new MorphingText();
    new CounterAnimation();
    new SkillBarAnimator();
    new FormHandler();

    console.log('%c✦ THE AURA ENGINE v6.0 — JAYAPRAKASH K (Performance Optimized)', 
        'background: linear-gradient(135deg, #6366f1, #ec4899); color: white; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 8px;');
    console.log('%c"No one in the world can replicate this."', 
        'color: #8b5cf6; font-style: italic; padding: 4px;');
});
