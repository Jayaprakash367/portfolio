// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;
    
    followerX += dx * 0.1;
    followerY += dy * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// Cursor hover effect
document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.borderColor = '#ff006e';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = '#00f3ff';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Particle Background Animation
const particlesCanvas = document.getElementById('particles');
const particlesCtx = particlesCanvas.getContext('2d');

particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#8338ec';
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > particlesCanvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        
        if (this.y > particlesCanvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }
    
    draw() {
        particlesCtx.fillStyle = this.color;
        particlesCtx.beginPath();
        particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particlesCtx.fill();
        
        // Add glow effect
        particlesCtx.shadowBlur = 15;
        particlesCtx.shadowColor = this.color;
    }
}

const particlesArray = [];
const numberOfParticles = 100;

for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particlesCtx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / 100})`;
                particlesCtx.lineWidth = 0.5;
                particlesCtx.beginPath();
                particlesCtx.moveTo(particlesArray[i].x, particlesArray[i].y);
                particlesCtx.lineTo(particlesArray[j].x, particlesArray[j].y);
                particlesCtx.stroke();
            }
        }
    }
}

function animateParticles() {
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Neural Network Background
const neuralCanvas = document.getElementById('neural-network');
const neuralCtx = neuralCanvas.getContext('2d');

neuralCanvas.width = window.innerWidth;
neuralCanvas.height = window.innerHeight;

class Neuron {
    constructor() {
        this.x = Math.random() * neuralCanvas.width;
        this.y = Math.random() * neuralCanvas.height;
        this.size = Math.random() * 4 + 2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.pulse = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.05;
        
        if (this.x < 0 || this.x > neuralCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > neuralCanvas.height) this.vy *= -1;
    }
    
    draw() {
        const pulseFactor = Math.sin(this.pulse) * 0.5 + 0.5;
        neuralCtx.fillStyle = `rgba(131, 56, 236, ${0.3 + pulseFactor * 0.3})`;
        neuralCtx.beginPath();
        neuralCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        neuralCtx.fill();
        
        neuralCtx.shadowBlur = 20;
        neuralCtx.shadowColor = '#8338ec';
    }
}

const neurons = [];
for (let i = 0; i < 50; i++) {
    neurons.push(new Neuron());
}

function connectNeurons() {
    for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
            const dx = neurons[i].x - neurons[j].x;
            const dy = neurons[i].y - neurons[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                neuralCtx.strokeStyle = `rgba(131, 56, 236, ${0.2 * (1 - distance / 150)})`;
                neuralCtx.lineWidth = 1;
                neuralCtx.beginPath();
                neuralCtx.moveTo(neurons[i].x, neurons[i].y);
                neuralCtx.lineTo(neurons[j].x, neurons[j].y);
                neuralCtx.stroke();
                
                // Add data flow animation
                const midX = (neurons[i].x + neurons[j].x) / 2;
                const midY = (neurons[i].y + neurons[j].y) / 2;
                const pulse = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
                
                neuralCtx.fillStyle = `rgba(255, 0, 110, ${pulse * 0.5})`;
                neuralCtx.beginPath();
                neuralCtx.arc(midX, midY, 2, 0, Math.PI * 2);
                neuralCtx.fill();
            }
        }
    }
}

function animateNeural() {
    neuralCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
    
    neurons.forEach(neuron => {
        neuron.update();
        neuron.draw();
    });
    
    connectNeurons();
    requestAnimationFrame(animateNeural);
}

animateNeural();

// Typing Animation
const texts = [
    'Full-Stack Developer & AI Enthusiast',
    'Building Intelligent Solutions',
    'Creative Problem Solver',
    'Machine Learning Engineer'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector('.typing-text');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let timeout = isDeleting ? deletingSpeed : typingSpeed;
    
    if (!isDeleting && charIndex === currentText.length) {
        timeout = pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    setTimeout(type, timeout);
}

type();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                animateCounter(counter);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Navbar background
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 243, 255, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.7)';
        navbar.style.boxShadow = 'none';
    }
    
    // Scroll progress bar
    const scrollProgress = document.querySelector('.scroll-progress');
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / windowHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = scrolled + '%';
    }
    
    lastScrollTop = scrollTop;
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}


// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add success animation
        const button = contactForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.style.background = 'linear-gradient(135deg, #8338ec, #ff006e)';
        
        setTimeout(() => {
            button.textContent = '✓ Message Sent!';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                contactForm.reset();
            }, 2000);
        }, 1500);
    });
}

// Add parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-robot, .ai-brain');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Particle explosion on click
particlesCanvas.addEventListener('click', (e) => {
    const explosionParticles = 20;
    const tempParticles = [];
    
    for (let i = 0; i < explosionParticles; i++) {
        const particle = {
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 10,
            speedY: (Math.random() - 0.5) * 10,
            color: '#ff006e',
            life: 100
        };
        tempParticles.push(particle);
    }
    
    function animateExplosion() {
        tempParticles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedY += 0.3; // gravity
            particle.life -= 2;
            
            if (particle.life > 0) {
                particlesCtx.fillStyle = `rgba(255, 0, 110, ${particle.life / 100})`;
                particlesCtx.beginPath();
                particlesCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                particlesCtx.fill();
            } else {
                tempParticles.splice(index, 1);
            }
        });
        
        if (tempParticles.length > 0) {
            requestAnimationFrame(animateExplosion);
        }
    }
    
    animateExplosion();
});

// Window resize handler
window.addEventListener('resize', () => {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    neuralCanvas.width = window.innerWidth;
    neuralCanvas.height = window.innerHeight;
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Skill cards glow on hover
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
        // Dynamically load and render projects
        fetch('projects.json')
            .then(res => res.json())
            .then(projects => {
                const container = document.getElementById('dynamic-projects');
                if (!container) return;
                container.innerHTML = '';
                Object.values(projects).forEach((proj, idx) => {
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    card.setAttribute('data-aos', 'flip-left');
                    if (idx > 0) card.setAttribute('data-aos-delay', idx * 100);

                    card.innerHTML = `
                        <div class="project-image">
                            <img src="${proj.image}" alt="${proj.title}">
                            <div class="project-overlay">
                                <a href="${proj.link}" class="project-link" target="_blank">View Project</a>
                            </div>
                        </div>
                        <div class="project-info">
                            <h3>${proj.title}</h3>
                            <p>${proj.description}</p>
                            <div class="project-tags">
                                <span>${proj.title}</span>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            });
});

// Robot eye follow cursor
const robotEyes = document.querySelectorAll('.robot-eye');
document.addEventListener('mousemove', (e) => {
    robotEyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const distance = Math.min(5, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 50);
        
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        eye.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
});

console.log('%c🤖 AI Portfolio Loaded! ', 'background: #00f3ff; color: #0a0a0f; font-size: 20px; padding: 10px;');
console.log('%cBuilt with cutting-edge web technologies', 'color: #8338ec; font-size: 14px;');
