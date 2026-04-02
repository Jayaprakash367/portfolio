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
// Desktop only - disabled on mobile/touch devices
// ═══════════════════════════════════════════
class TiltEffect {
    constructor() {
        // Skip tilt effects on mobile/touch devices
        if (this.isMobile()) return;
        
        this.elements = document.querySelectorAll('[data-tilt]');
        this.elements.forEach(el => this.addTilt(el));
    }
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
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
// Magnetic Buttons - Desktop only
// Disabled on mobile/touch devices for cleaner UX
class MagneticButtons {
    constructor() {
        // Skip magnetic effects on mobile/touch devices
        if (this.isMobile()) return;
        
        this.buttons = document.querySelectorAll('[data-magnetic]');
        this.buttons.forEach(btn => this.addMagnetic(btn));
    }
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
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
// XIII. LIQUID TEXT SCRAMBLE (Enhanced)
// Desktop hover only - disabled on mobile
// ═══════════════════════════════════════════
class TextScramble {
    constructor() {
        // Skip on mobile/touch devices
        if (this.isMobile()) return;
        
        this.chars = '!<>-_\\/[]{}—=+*^?#◆◇○●□■△▽▷◁';
        this.elements = document.querySelectorAll('.scramble-text');
        this.elements.forEach(el => this.addScramble(el));
    }
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
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
        // Skip on mobile/touch devices
        if (this.isMobile()) return;
        
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
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
    }
}

// ═══════════════════════════════════════════
// XIX. GLITCH EFFECT (Random cinematic glitch)
// Disabled on mobile for performance and clean UX
// ═══════════════════════════════════════════
class GlitchEffect {
    constructor() {
        // Skip on mobile/touch devices
        if (this.isMobile()) return;
        
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
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
    }
}

// ═══════════════════════════════════════════
// XX. CARD SPOTLIGHT EFFECT (Mouse-reactive lighting)
// Desktop only - disabled on mobile/touch devices
// ═══════════════════════════════════════════
class CardSpotlight {
    constructor() {
        // Skip on mobile/touch devices
        if (this.isMobile()) return;
        
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
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
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
// XXV. BUBBLE POP GAME - PROFESSIONAL EDITION
// ═══════════════════════════════════════════
class BubblePopGame {
    constructor() {
        this.trigger = document.getElementById('gameTrigger');
        this.game = document.getElementById('bubbleGame');
        this.arena = document.getElementById('gameArena');
        this.overlay = document.getElementById('gameOverlay');
        this.startBtn = document.getElementById('gameStartBtn');
        this.closeBtn = document.getElementById('gameClose');
        this.exitBtn = document.getElementById('gameExitBtn');
        this.scoreDisplay = document.getElementById('gameScore');
        this.timerDisplay = document.getElementById('gameTimer');
        this.finalScoreDisplay = document.getElementById('finalScore');
        
        if (!this.trigger || !this.game) return;
        
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = false;
        this.bubbleInterval = null;
        this.timerInterval = null;
        this.bubbles = new Set();
        this.combo = 0;
        this.lastPopTime = 0;
        this.highScore = parseInt(localStorage.getItem('bubbleHighScore') || '0');
        this.difficulty = 1;
        this.spawnRate = 700;
        
        // Audio context for sound effects
        this.audioCtx = null;
        
        this.init();
    }
    
    init() {
        // Initialize audio on first interaction
        const initAudio = () => {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            document.removeEventListener('pointerdown', initAudio);
        };
        document.addEventListener('pointerdown', initAudio, { once: true });
        
        // Use Pointer Events API for unified touch/mouse handling
        this.trigger.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.openGame();
        });
        
        this.closeBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.closeGame();
        });
        
        this.startBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.startGame();
        });
        
        // Exit button - close game and return to page
        if (this.exitBtn) {
            this.exitBtn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.closeGame();
            });
        }
        
        // Prevent context menu and text selection in game area
        this.game.addEventListener('contextmenu', e => e.preventDefault());
        this.game.addEventListener('selectstart', e => e.preventDefault());
        
        // Handle touch events for better mobile experience
        this.game.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.game.classList.contains('active')) {
                this.closeGame();
            }
        });
        
        // ✨ HOVER MODE: Use pointerenter (hover) instead of pointerdown (click)
        // This makes bubbles pop when you hover over them!
        this.arena.addEventListener('pointerenter', (e) => this.handleArenaPointer(e), true);
    }
    
    handleArenaPointer(e) {
        if (!this.isPlaying) return;
        
        const target = e.target;
        if (target.classList.contains('game-bubble') && !target.classList.contains('popped')) {
            e.preventDefault();
            e.stopPropagation();
            
            const points = parseInt(target.dataset.points) || 1;
            this.popBubble(e, target, points);
        }
    }
    
    playPopSound(frequency = 800) {
        if (!this.audioCtx) return;
        
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.audioCtx.currentTime + 0.05);
            osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.audioCtx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);
            
            osc.type = 'sine';
            osc.start(this.audioCtx.currentTime);
            osc.stop(this.audioCtx.currentTime + 0.15);
        } catch (e) {
            // Audio not supported
        }
    }
    
    vibrate(pattern = 10) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
    
    openGame() {
        this.game.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.resetGame();
    }
    
    closeGame() {
        this.game.classList.remove('active');
        document.body.style.overflow = '';
        this.stopGame();
    }
    
    resetGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.combo = 0;
        this.difficulty = 1;
        this.spawnRate = 700;
        this.scoreDisplay.textContent = '0';
        this.timerDisplay.textContent = '30';
        this.overlay.classList.remove('hidden');
        this.startBtn.textContent = 'START GAME';
        // Hide exit button on initial open, show only after game ends
        if (this.exitBtn) this.exitBtn.style.display = 'none';
        const finalScoreEl = document.querySelector('.game-final-score');
        if (finalScoreEl) finalScoreEl.classList.remove('show');
        this.clearBubbles();
        
        // Update high score display if exists
        const highScoreEl = document.getElementById('highScore');
        if (highScoreEl) highScoreEl.textContent = this.highScore;
    }
    
    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.timeLeft = 30;
        this.combo = 0;
        this.difficulty = 1;
        this.spawnRate = 700;
        this.lastPopTime = Date.now();
        this.scoreDisplay.textContent = '0';
        this.timerDisplay.textContent = '30';
        this.overlay.classList.add('hidden');
        this.clearBubbles();
        
        // Spawn initial bubbles faster
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.spawnBubble(), i * 200);
        }
        
        // Dynamic spawn rate
        this.scheduleNextSpawn();
        
        // Timer with urgency effects
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft;
            
            // Urgency visual when low time
            if (this.timeLeft <= 10) {
                this.timerDisplay.classList.add('urgent');
                if (this.timeLeft <= 5) {
                    this.timerDisplay.classList.add('critical');
                }
            }
            
            // Increase difficulty over time
            if (this.timeLeft === 20) {
                this.difficulty = 1.3;
                this.spawnRate = 550;
            } else if (this.timeLeft === 10) {
                this.difficulty = 1.6;
                this.spawnRate = 400;
            }
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    scheduleNextSpawn() {
        if (!this.isPlaying) return;
        
        this.bubbleInterval = setTimeout(() => {
            this.spawnBubble();
            this.scheduleNextSpawn();
        }, this.spawnRate + Math.random() * 200);
    }
    
    stopGame() {
        this.isPlaying = false;
        if (this.bubbleInterval) {
            clearTimeout(this.bubbleInterval);
            this.bubbleInterval = null;
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timerDisplay.classList.remove('urgent', 'critical');
        this.clearBubbles();
    }
    
    endGame() {
        this.stopGame();
        this.finalScoreDisplay.textContent = this.score;
        const finalScoreEl = document.querySelector('.game-final-score');
        if (finalScoreEl) finalScoreEl.classList.add('show');
        this.overlay.classList.remove('hidden');
        this.startBtn.textContent = 'PLAY AGAIN';
        // Show exit button after game ends
        if (this.exitBtn) this.exitBtn.style.display = 'block';
        
        // Save high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('bubbleHighScore', this.highScore.toString());
            this.celebrateNewRecord();
        } else if (this.score >= 30) {
            this.celebrate();
        }
    }
    
    spawnBubble() {
        if (!this.isPlaying || !this.arena) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'game-bubble';
        
        // Random size with weighted distribution (more medium-sized)
        const sizeRand = Math.random();
        let size;
        if (sizeRand < 0.2) {
            size = 45 + Math.random() * 15; // Small (harder, more points)
        } else if (sizeRand < 0.7) {
            size = 60 + Math.random() * 20; // Medium
        } else {
            size = 80 + Math.random() * 25; // Large (easier, fewer points)
        }
        
        bubble.style.setProperty('--size', size + 'px');
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        
        // Random horizontal position with safe margins
        const margin = size / 2 + 10;
        const maxX = Math.max(margin, this.arena.offsetWidth - size - margin);
        const posX = Math.random() * (maxX - margin) + margin;
        bubble.style.left = posX + 'px';
        
        // Start position below arena
        const arenaHeight = this.arena.offsetHeight;
        bubble.style.bottom = '-' + (size + 20) + 'px';
        
        // Speed based on size and difficulty (smaller = faster)
        const baseSpeed = 4.5 - (size / 40);
        const duration = Math.max(2.5, baseSpeed / this.difficulty);
        
        // Assign bubble type and color
        const types = ['normal', 'golden', 'rainbow'];
        const typeRand = Math.random();
        let bubbleType = 'normal';
        if (typeRand > 0.95) {
            bubbleType = 'rainbow';
        } else if (typeRand > 0.85) {
            bubbleType = 'golden';
        }
        bubble.dataset.type = bubbleType;
        bubble.classList.add('bubble-' + bubbleType);
        
        // Calculate points
        let points = Math.ceil((105 - size) / 15);
        if (bubbleType === 'golden') points *= 3;
        if (bubbleType === 'rainbow') points *= 5;
        
        bubble.dataset.points = points;
        bubble.dataset.size = size;
        
        // Set touch-action for better mobile handling
        bubble.style.touchAction = 'none';
        
        this.arena.appendChild(bubble);
        this.bubbles.add(bubble);
        
        // Animate with requestAnimationFrame for smoother motion
        const startTime = performance.now();
        const startY = -size - 20;
        const endY = arenaHeight + size + 50;
        const wobbleAmount = 15 + Math.random() * 15;
        const wobbleSpeed = 2 + Math.random() * 2;
        
        const animate = (currentTime) => {
            if (!this.isPlaying || !bubble.parentNode || bubble.classList.contains('popped')) {
                return;
            }
            
            const elapsed = (currentTime - startTime) / 1000;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                this.removeBubble(bubble);
                return;
            }
            
            // Smooth rise with sine wave wobble
            const currentY = startY + (endY - startY) * progress;
            const wobbleX = Math.sin(elapsed * wobbleSpeed) * wobbleAmount;
            const rotate = Math.sin(elapsed * 1.5) * 10;
            const scale = 1 + Math.sin(elapsed * 3) * 0.05;
            
            bubble.style.transform = `translate(${wobbleX}px, ${-currentY}px) rotate(${rotate}deg) scale(${scale})`;
            
            bubble._animationId = requestAnimationFrame(animate);
        };
        
        bubble._animationId = requestAnimationFrame(animate);
        bubble._startTime = startTime;
        bubble._duration = duration;
    }
    
    popBubble(e, bubble, points) {
        if (!bubble || bubble.classList.contains('popped') || !this.isPlaying) return;
        
        // Mark as popped immediately to prevent double-taps
        bubble.classList.add('popped');
        
        // Cancel animation
        if (bubble._animationId) {
            cancelAnimationFrame(bubble._animationId);
        }
        
        // Calculate combo
        const now = Date.now();
        if (now - this.lastPopTime < 800) {
            this.combo = Math.min(this.combo + 1, 10);
        } else {
            this.combo = 1;
        }
        this.lastPopTime = now;
        
        // Apply combo multiplier
        const comboMultiplier = 1 + (this.combo - 1) * 0.2;
        const finalPoints = Math.round(points * comboMultiplier);
        
        this.score += finalPoints;
        this.scoreDisplay.textContent = this.score;
        
        // Visual feedback
        this.scoreDisplay.classList.add('score-pop');
        setTimeout(() => this.scoreDisplay.classList.remove('score-pop'), 200);
        
        // Get bubble position for effects
        const rect = bubble.getBoundingClientRect();
        const arenaRect = this.arena.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - arenaRect.left;
        const y = rect.top + rect.height / 2 - arenaRect.top;
        
        // Sound and haptic feedback
        const freq = 600 + (points * 50) + (this.combo * 100);
        this.playPopSound(freq);
        this.vibrate(this.combo > 3 ? [10, 10, 10] : 8);
        
        // Show score popup
        this.showScorePopup(x, y, finalPoints, this.combo);
        
        // Create pop effect
        const bubbleType = bubble.dataset.type;
        this.createPopEffect(x, y, bubbleType, parseInt(bubble.dataset.size) || 70);
        
        // Pop animation
        bubble.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        bubble.style.transform += ' scale(1.4)';
        bubble.style.opacity = '0';
        
        // Remove bubble
        setTimeout(() => this.removeBubble(bubble), 200);
    }
    
    showScorePopup(x, y, points, combo) {
        const popup = document.createElement('div');
        popup.className = 'pop-score';
        if (combo > 1) {
            popup.innerHTML = `+${points}<span class="combo-text">x${combo}</span>`;
            popup.classList.add('combo-' + Math.min(combo, 5));
        } else {
            popup.textContent = '+' + points;
        }
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        
        this.arena.appendChild(popup);
        
        // Animate using CSS
        requestAnimationFrame(() => {
            popup.classList.add('animate');
        });
        
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 800);
    }
    
    createPopEffect(x, y, type = 'normal', size = 70) {
        const particleCount = type === 'rainbow' ? 16 : type === 'golden' ? 12 : 8;
        const colors = {
            normal: ['#00d4ff', '#14b8a6', '#06b6d4', '#22d3ee'],
            golden: ['#ffd700', '#ffb700', '#ffa500', '#fff4b8'],
            rainbow: ['#ff0080', '#ff8c00', '#ffef00', '#00ff00', '#00bfff', '#8b00ff']
        };
        
        const particleColors = colors[type] || colors.normal;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'pop-particle';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 30 + Math.random() * (size * 0.5);
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            const particleSize = 4 + Math.random() * 6;
            
            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                width: ${particleSize}px;
                height: ${particleSize}px;
                background: ${particleColors[i % particleColors.length]};
                --tx: ${tx}px;
                --ty: ${ty}px;
                --rotate: ${Math.random() * 720}deg;
            `;
            
            this.arena.appendChild(particle);
            
            // Trigger animation
            requestAnimationFrame(() => particle.classList.add('animate'));
            
            setTimeout(() => {
                if (particle.parentNode) particle.remove();
            }, 500);
        }
        
        // Ring effect for special bubbles
        if (type !== 'normal') {
            const ring = document.createElement('div');
            ring.className = 'pop-ring pop-ring-' + type;
            ring.style.left = x + 'px';
            ring.style.top = y + 'px';
            this.arena.appendChild(ring);
            
            setTimeout(() => {
                if (ring.parentNode) ring.remove();
            }, 500);
        }
    }
    
    celebrate() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                if (!this.arena?.parentNode) return;
                
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    left: ${Math.random() * 100}%;
                    --hue: ${Math.random() * 360};
                    --delay: ${Math.random() * 0.5}s;
                    --duration: ${2 + Math.random()}s;
                    --drift: ${(Math.random() - 0.5) * 100}px;
                `;
                
                this.arena.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 60);
        }
    }
    
    celebrateNewRecord() {
        // Extra celebration for new high score
        this.celebrate();
        
        const banner = document.createElement('div');
        banner.className = 'new-record-banner';
        banner.innerHTML = `<span>🏆 NEW HIGH SCORE! 🏆</span>`;
        this.overlay.querySelector('.game-message').prepend(banner);
        
        // Vibrate pattern for celebration
        this.vibrate([100, 50, 100, 50, 200]);
        
        setTimeout(() => banner.remove(), 5000);
    }
    
    removeBubble(bubble) {
        this.bubbles.delete(bubble);
        if (bubble._animationId) {
            cancelAnimationFrame(bubble._animationId);
        }
        if (bubble.parentNode) {
            bubble.remove();
        }
    }
    
    clearBubbles() {
        this.bubbles.forEach(bubble => {
            if (bubble._animationId) {
                cancelAnimationFrame(bubble._animationId);
            }
            if (bubble.parentNode) bubble.remove();
        });
        this.bubbles.clear();
        
        if (this.arena) {
            const elements = this.arena.querySelectorAll('.game-bubble, .pop-score, .pop-particle, .pop-ring, .confetti');
            elements.forEach(el => el.remove());
        }
    }
}

// ═══════════════════════════════════════════
// XXVI. INITIALIZE THE AURA ENGINE
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // ── Mobile Performance: Make hero content visible immediately ──
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
                     window.innerWidth <= 768 ||
                     'ontouchstart' in window;
    
    if (isMobile) {
        // Force hero content visible immediately
        const heroElements = document.querySelectorAll(`
            .hero-title, .title-word, .hero-subtitle, .subtitle-text,
            .hero-description, .hero-cta, .hero-stats, .hero-badge,
            .profile-card-wrapper, .hero-content
        `);
        heroElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.animation = 'none';
        });
        console.log('✓ Mobile: Hero content made visible immediately');
    }
    
    // ── Core Systems ──
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
    
    // ── Fun Game ──
    new BubblePopGame();
    
    // ── Advanced Animation Systems ──
    new LenisSmoothScroll();
    new ScrollAnimations();
    new AdvancedParallax();
    new CustomCursor();
    new TextSplitAnimation();
    new MicroInteractions();
    new PerformanceOptimizer();

    console.log('%c✦ AQUA FLOW ENGINE v6.0 — JAYAPRAKASH K', 
        'background: linear-gradient(135deg, #00d4ff, #14b8a6); color: #0a1628; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 8px;');
    console.log('%c"Dive into the experience."', 
        'color: #00d4ff; font-style: italic; padding: 4px;');
});

// ═══════════════════════════════════════════
// XXVII. LENIS SMOOTH SCROLL INTEGRATION
// ═══════════════════════════════════════════
class LenisSmoothScroll {
    constructor() {
        // Skip Lenis on mobile for better performance
        if (this.isMobile()) {
            console.log('⊘ Lenis disabled on mobile for performance');
            return;
        }
        
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis not loaded, using native smooth scroll');
            return;
        }
        
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });
        
        // Add Lenis class to html
        document.documentElement.classList.add('lenis');
        
        // Animation frame loop
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    this.lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5
                    });
                }
            });
        });
        
        console.log('✓ Lenis Smooth Scroll initialized');
    }
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
    }
}

// ═══════════════════════════════════════════
// XXVIII. SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
// Optimized for mobile - simpler animations
// ═══════════════════════════════════════════
class ScrollAnimations {
    constructor() {
        this.isMobileDevice = this.isMobile();
        
        this.observerOptions = {
            root: null,
            rootMargin: this.isMobileDevice ? '0px' : '0px 0px -100px 0px',
            threshold: this.isMobileDevice ? 0.05 : 0.1
        };
        
        this.init();
    }
    
    isMobile() {
        return window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
    }
    
    init() {
        // On mobile, make everything visible immediately for performance
        if (this.isMobileDevice) {
            this.makeAllVisible();
            console.log('✓ Mobile: Content made visible immediately');
            return;
        }
        
        // Create observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optionally unobserve after animation
                    // this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        // Auto-add animation classes to common elements
        this.autoAnnotate();
        
        // Observe all elements with animation classes
        this.observeElements();
        
        console.log('✓ Scroll Animations initialized');
    }
    
    makeAllVisible() {
        // On mobile, show everything without animations for better performance
        const elements = document.querySelectorAll(`
            .fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right,
            .scale-in, .scale-in-up, .rotate-in, .blur-in, .slide-in-bounce,
            .animate-on-scroll, .glass-card, .featured-item, .interest-card,
            .project-card, .skill-category-block, .edu-item, .section-title,
            section, .hero-content, .profile-card-wrapper, .title-word,
            .hero-title, .hero-subtitle, .hero-description, .hero-cta, .hero-stats
        `);
        
        elements.forEach(el => {
            el.classList.add('animated');
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.animation = 'none';
        });
    }
    
    autoAnnotate() {
        // Auto-add fade-in-up to sections
        document.querySelectorAll('section:not(.hero)').forEach(section => {
            if (!section.classList.contains('fade-in-up')) {
                section.classList.add('fade-in-up');
            }
        });
        
        // Auto-add animations to cards
        document.querySelectorAll('.glass-card, .featured-item, .interest-card, .project-card, .skill-category-block, .edu-item').forEach((el, index) => {
            if (!el.className.match(/fade-in|scale-in|slide-in/)) {
                el.classList.add('scale-in-up', `stagger-${(index % 5) + 1}`);
            }
        });
        
        // Auto-add to titles
        document.querySelectorAll('.section-title').forEach(title => {
            if (!title.className.match(/fade-in/)) {
                title.classList.add('fade-in-up');
            }
        });
    }
    
    observeElements() {
        const animatedElements = document.querySelectorAll(`
            .fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right,
            .scale-in, .scale-in-up, .rotate-in, .blur-in, .slide-in-bounce,
            .animate-on-scroll
        `);
        
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ═══════════════════════════════════════════
// XXIX. ADVANCED PARALLAX EFFECTS
// ═══════════════════════════════════════════
class AdvancedParallax {
    constructor() {
        if (window.innerWidth < 768) {
            console.log('⊘ Parallax disabled on mobile');
            return;
        }
        
        this.elements = {
            slow: document.querySelectorAll('.parallax-slow'),
            medium: document.querySelectorAll('.parallax, [data-parallax]'),
            fast: document.querySelectorAll('.parallax-fast')
        };
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.update(), { passive: true });
        this.update();
        console.log('✓ Advanced Parallax initialized');
    }
    
    update() {
        const scrollY = window.pageYOffset;
        
        // Slow parallax (0.2x speed)
        this.elements.slow.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.2;
            const yPos = -(scrollY * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        // Medium parallax (0.5x speed)
        this.elements.medium.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.5;
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const yPos = -(scrollY - elementTop) * speed;
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        // Fast parallax (0.8x speed)
        this.elements.fast.forEach(el => {
            const speed = parseFloat(el.dataset.speed) || 0.8;
            const yPos = -(scrollY * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// ═══════════════════════════════════════════
// XXX. CUSTOM CURSOR
// ═══════════════════════════════════════════
class CustomCursor {
    constructor() {
        if ('ontouchstart' in window || window.innerWidth < 768) {
            console.log('⊘ Custom cursor disabled on touch devices');
            return;
        }
        
        this.cursor = this.createCursor();
        this.follower = this.createFollower();
        this.cursorPos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        
        this.init();
    }
    
    createCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        return cursor;
    }
    
    createFollower() {
        const follower = document.createElement('div');
        follower.className = 'custom-cursor-follower';
        document.body.appendChild(follower);
        return follower;
    }
    
    init() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.cursorPos = { x: e.clientX, y: e.clientY };
            
            if (!this.cursor.classList.contains('visible')) {
                this.cursor.classList.add('visible');
                this.follower.classList.add('visible');
            }
        });
        
        // Mouse leave
        document.addEventListener('mouseleave', () => {
            this.cursor.classList.remove('visible');
            this.follower.classList.remove('visible');
        });
        
        // Interactive elements
        const interactiveElements = 'a, button, .btn-primary, .btn-secondary, .project-card, .interest-card, .nav-link, input, textarea';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
        
        // Animate cursor
        this.animate();
        console.log('✓ Custom Cursor initialized');
    }
    
    animate() {
        // Smooth cursor movement with lerp
        this.followerPos.x += (this.cursorPos.x - this.followerPos.x) * 0.15;
        this.followerPos.y += (this.cursorPos.y - this.followerPos.y) * 0.15;
        
        this.cursor.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0)`;
        this.follower.style.transform = `translate3d(${this.followerPos.x}px, ${this.followerPos.y}px, 0)`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════
// XXXI. TEXT SPLIT ANIMATION
// ═══════════════════════════════════════════
class TextSplitAnimation {
    constructor() {
        this.elements = document.querySelectorAll('.split-text, [data-split]');
        if (this.elements.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            this.splitText(el);
        });
        
        // Observe for animation trigger
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateText(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.elements.forEach(el => observer.observe(el));
        console.log('✓ Text Split Animation initialized');
    }
    
    splitText(element) {
        const text = element.textContent;
        const chars = text.split('');
        element.textContent = '';
        
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${index * 0.03}s`;
            element.appendChild(span);
        });
    }
    
    animateText(element) {
        element.classList.add('animated');
    }
}

// ═══════════════════════════════════════════
// XXXII. MICRO-INTERACTIONS
// ═══════════════════════════════════════════
class MicroInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.addButtonRipples();
        this.addCardHoverEffects();
        this.addInputFocusEffects();
        this.addLoadingStates();
        console.log('✓ Micro-interactions initialized');
    }
    
    addButtonRipples() {
        document.querySelectorAll('.btn-primary, .btn-secondary, button').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    addCardHoverEffects() {
        document.querySelectorAll('.project-card, .interest-card, .glass-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
        });
    }
    
    addInputFocusEffects() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement?.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement?.classList.remove('focused');
            });
        });
    }
    
    addLoadingStates() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('[type="submit"]');
                if (submitBtn && !submitBtn.classList.contains('loading')) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
            });
        });
    }
}

// ═══════════════════════════════════════════
// XXXIII. PERFORMANCE OPTIMIZER
// ═══════════════════════════════════════════
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
        this.handleReducedMotion();
        console.log('✓ Performance Optimizer initialized');
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeAnimations() {
        // Add will-change only when needed
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.willChange = 'transform, opacity';
                } else {
                    entry.target.style.willChange = 'auto';
                }
            });
        }, { rootMargin: '200px' });
        
        animatedElements.forEach(el => observer.observe(el));
    }
    
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduce-motion');
            console.log('⊘ Reduced motion enabled');
        }
    }
}

