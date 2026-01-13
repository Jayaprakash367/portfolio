// ========================================
// GLOBAL VARIABLES & CONFIGURATION
// ========================================
const config = {
    cursorTrail: {
        maxParticles: 30,
        particleLife: 60,
        colors: ['rgba(0, 255, 136, 0.5)', 'rgba(0, 204, 106, 0.5)']
    },
    particleField: {
        particleCount: 80,
        maxSpeed: 0.5,
        connectionDistance: 150
    },
    magneticStrength: 0.3,
    tiltStrength: 20
};

// ========================================
// PAGE LOADER
// ========================================
class PageLoader {
    constructor() {
        this.loader = document.querySelector('.page-loader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 1000);
        });
    }

    hide() {
        if (this.loader) {
            this.loader.classList.add('hidden');
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 500);
        }
    }
}

// ========================================
// LIQUID CURSOR
// ========================================
class LiquidCursor {
    constructor() {
        this.cursor = document.querySelector('.liquid-cursor');
        this.cursorPos = { x: 0, y: 0 };
        this.cursorTarget = { x: 0, y: 0 };
        this.init();
    }

    init() {
        if (!this.cursor) return;

        document.addEventListener('mousemove', (e) => {
            this.cursorTarget.x = e.clientX;
            this.cursorTarget.y = e.clientY;
        });

        // Add hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .interest-card, .project-item, .skill-category, .cert-card, .magnetic-btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });

        // Click effect
        document.addEventListener('mousedown', () => this.cursor.classList.add('click'));
        document.addEventListener('mouseup', () => this.cursor.classList.remove('click'));

        this.animate();
    }

    animate() {
        // Smooth cursor follow with easing
        this.cursorPos.x += (this.cursorTarget.x - this.cursorPos.x) * 0.15;
        this.cursorPos.y += (this.cursorTarget.y - this.cursorPos.y) * 0.15;

        this.cursor.style.left = this.cursorPos.x + 'px';
        this.cursor.style.top = this.cursorPos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// CURSOR TRAIL CANVAS
// ========================================
class CursorTrail {
    constructor() {
        this.canvas = document.getElementById('cursor-trail');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePos = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            this.addParticle();
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addParticle() {
        if (this.particles.length >= config.cursorTrail.maxParticles) {
            this.particles.shift();
        }

        this.particles.push({
            x: this.mousePos.x,
            y: this.mousePos.y,
            life: config.cursorTrail.particleLife,
            size: Math.random() * 3 + 2,
            color: config.cursorTrail.colors[Math.floor(Math.random() * config.cursorTrail.colors.length)]
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.life--;
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            const alpha = particle.life / config.cursorTrail.particleLife;
            this.ctx.fillStyle = particle.color.replace('0.5', alpha.toString());
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// PARTICLE FIELD BACKGROUND
// ========================================
class ParticleField {
    constructor() {
        this.canvas = document.getElementById('particle-field');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < config.particleField.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * config.particleField.maxSpeed,
                vy: (Math.random() - 0.5) * config.particleField.maxSpeed,
                size: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.particleField.connectionDistance) {
                    const alpha = 1 - (distance / config.particleField.connectionDistance);
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${alpha * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// FULLSCREEN MENU
// ========================================
class FullscreenMenu {
    constructor() {
        this.menuBtn = document.querySelector('.nav-menu-btn');
        this.menu = document.querySelector('.fullscreen-menu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.menuBtn || !this.menu) return;

        this.menuBtn.addEventListener('click', () => this.toggle());

        // Close menu when clicking a link
        const menuLinks = this.menu.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.open();
        } else {
            this.close();
        }
    }

    open() {
        this.menu.classList.add('active');
        this.menuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.menu.classList.remove('active');
        this.menuBtn.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

// ========================================
// MAGNETIC BUTTONS
// ========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.handleMove(e, button));
            button.addEventListener('mouseleave', (e) => this.handleLeave(e, button));
        });
    }

    handleMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * config.magneticStrength}px, ${y * config.magneticStrength}px)`;
    }

    handleLeave(e, button) {
        button.style.transform = 'translate(0, 0)';
    }
}

// ========================================
// 3D TILT EFFECT
// ========================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.profile-card, .interest-card, .project-content');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
        });
    }

    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -config.tiltStrength;
        const rotateY = ((x - centerX) / centerX) * config.tiltStrength;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    handleLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
}

// ========================================
// TYPING ANIMATION
// ========================================
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.profile-role');
        if (!this.element) return;

        this.texts = [
            'Full Stack Developer',
            'AI & ML Enthusiast',
            'Cybersecurity Specialist',
            'Problem Solver'
        ];
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.speed = 100;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const fullText = this.texts[this.currentIndex];

        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }

        this.element.innerHTML = this.currentText + '<span class="typing-cursor"></span>';

        let speed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentText === fullText) {
            speed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }
}

// ========================================
// SKILL BARS ANIMATION
// ========================================
class SkillBars {
    constructor() {
        this.skillItems = document.querySelectorAll('.skill-item');
        this.init();
    }

    init() {
        if (this.skillItems.length === 0) return;

        // Create intersection observer for animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkill(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.skillItems.forEach(item => observer.observe(item));
    }

    animateSkill(item) {
        const level = item.getAttribute('data-level');
        const fillBar = item.querySelector('.skill-fill');
        
        if (fillBar && level) {
            setTimeout(() => {
                fillBar.style.width = level + '%';
            }, 200);
        }
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.timeline-item, .project-item, .skill-category, .cert-card');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// ========================================
// FLOATING SHAPES ANIMATION
// ========================================
class FloatingShapes {
    constructor() {
        this.shapes = document.querySelectorAll('.shape');
        this.init();
    }

    init() {
        this.shapes.forEach((shape, index) => {
            const randomDelay = Math.random() * 5;
            const randomDuration = 15 + Math.random() * 10;
            shape.style.animationDelay = `-${randomDelay}s`;
            shape.style.animationDuration = `${randomDuration}s`;
        });
    }
}

// ========================================
// PARALLAX EFFECT
// ========================================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.shape, .floating-shapes');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            this.elements.forEach((el, index) => {
                const speed = 0.5 + (index * 0.1);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// ========================================
// PROJECT CARDS REVEAL
// ========================================
class ProjectCards {
    constructor() {
        this.projects = document.querySelectorAll('.project-item');
        this.init();
    }

    init() {
        if (this.projects.length === 0) return;

        this.projects.forEach((project, index) => {
            project.style.opacity = '0';
            project.style.transform = 'translateY(50px)';
            project.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(project);
        });
    }
}

// ========================================
// INTEREST CARDS STAGGER
// ========================================
class InterestCards {
    constructor() {
        this.cards = document.querySelectorAll('.interest-card');
        this.init();
    }

    init() {
        if (this.cards.length === 0) return;

        this.cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1 + 0.3}s, transform 0.6s ease ${index * 0.1 + 0.3}s`;

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
    }
}

// ========================================
// NAVIGATION SCROLL EFFECT
// ========================================
class NavigationScroll {
    constructor() {
        this.nav = document.querySelector('.main-nav');
        this.init();
    }

    init() {
        if (!this.nav) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                this.nav.style.transform = 'translateY(0)';
                return;
            }

            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.nav.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }
}

// ========================================
// CONTACT FORM HANDLER
// ========================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            // Form will submit normally to Formspree
            // Show loading state
            const submitBtn = this.form.querySelector('.submit-btn');
            if (submitBtn) {
                const btnText = submitBtn.querySelector('.btn-text');
                btnText.textContent = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.6';
            }
        });
    }
}

// ========================================
// INIT ALL FEATURES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Core features
    new PageLoader();
    new LiquidCursor();
    new CursorTrail();
    new ParticleField();
    new FullscreenMenu();
    
    // Interactive effects
    new MagneticButtons();
    new TiltEffect();
    new TypingAnimation();
    new SkillBars();
    new SmoothScroll();
    
    // Scroll animations
    new ScrollAnimations();
    new FloatingShapes();
    new ParallaxEffect();
    new ProjectCards();
    new InterestCards();
    new NavigationScroll();
    
    // Contact form
    new ContactForm();

    // Add active page indicator to menu
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Reduce animations on low-performance devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    config.particleField.particleCount = 40;
    config.cursorTrail.maxParticles = 15;
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});
