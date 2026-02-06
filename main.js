/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  JAYAPRAKASH K — THE AURA ENGINE v5.0                               ║
   ║  "No one in the world can replicate this."                          ║
   ║                                                                      ║
   ║  Systems: WebGL Shaders • Particle Constellation • Morphing Blobs   ║
   ║  Cursor Trail • Click Ripples • Floating Geometry • DNA Loader      ║
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
// I. WEBGL AURORA SHADER (Enhanced with Fractal Warp)
// ═══════════════════════════════════════════
class AuroraShader {
    constructor() {
        this.canvas = document.getElementById('shader-bg');
        if (!this.canvas) return;
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) return;
        this.mouse = { x: 0.5, y: 0.5 };
        this.smoothMouse = { x: 0.5, y: 0.5 };
        this.time = 0;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX / window.innerWidth;
            this.mouse.y = 1.0 - e.clientY / window.innerHeight;
        });

        const vertSrc = `
            attribute vec2 a_position;
            void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
        `;

        const fragSrc = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;

            vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                                   -0.577350269189626, 0.024390243902439);
                vec2 i = floor(v + dot(v, C.yy));
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m * m; m = m * m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                vec3 g;
                g.x = a0.x * x0.x + h.x * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            // Fractal Brownian Motion for ultra-organic movement
            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 1.0;
                for(int i = 0; i < 6; i++) {
                    value += amplitude * snoise(p * frequency);
                    frequency *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            // Domain warping for alien-like patterns
            float warpedNoise(vec2 p, float t) {
                vec2 q = vec2(fbm(p + vec2(0.0, 0.0)),
                              fbm(p + vec2(5.2, 1.3)));
                vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * t),
                              fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.126 * t));
                return fbm(p + 4.0 * r);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                float t = u_time * 0.08;
                float aspect = u_resolution.x / u_resolution.y;
                vec2 p = uv * vec2(aspect, 1.0);
                
                // Mouse influence — creates a gravitational distortion
                float mouseDist = length(uv - u_mouse);
                float mouseWarp = smoothstep(0.6, 0.0, mouseDist) * 0.4;
                p += mouseWarp * normalize(uv - u_mouse) * 0.3;
                
                // Domain-warped fractal noise — creates unique alien aurora
                float n = warpedNoise(p * 0.8, t);
                
                // Additional flowing layers
                float n2 = snoise(uv * 3.0 + vec2(t * 0.3, n * 0.5));
                float n3 = snoise(uv * 5.0 + vec2(n2 * 0.3, -t * 0.2));
                
                // Color palette — deep void aurora
                vec3 col1 = vec3(0.388, 0.400, 0.945);  // Indigo
                vec3 col2 = vec3(0.545, 0.361, 0.965);  // Violet
                vec3 col3 = vec3(0.925, 0.282, 0.600);  // Pink
                vec3 col4 = vec3(0.024, 0.714, 0.831);  // Cyan
                vec3 col5 = vec3(0.063, 0.725, 0.506);  // Emerald
                
                float blend = n * 0.5 + 0.5;
                vec3 col = mix(col1, col2, smoothstep(0.0, 0.3, blend));
                col = mix(col, col3, smoothstep(0.3, 0.5, blend));
                col = mix(col, col4, smoothstep(0.5, 0.7, blend));
                col = mix(col, col5, smoothstep(0.7, 1.0, blend) * 0.3);
                
                // Intensity modulation
                float intensity = smoothstep(-0.3, 0.8, n) * 0.3;
                intensity += mouseWarp * 0.5;
                intensity += n2 * 0.05 + n3 * 0.03;
                
                col *= intensity;
                
                // Vignette
                float vig = 1.0 - smoothstep(0.2, 1.3, length((uv - 0.5) * 1.6));
                col *= vig;
                
                // Subtle chromatic pulse
                col.r *= 1.0 + sin(t * 2.0) * 0.05;
                col.b *= 1.0 + cos(t * 1.5) * 0.05;
                
                gl_FragColor = vec4(col, 1.0);
            }
        `;

        const gl = this.gl;
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertSrc);
        gl.compileShader(vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragSrc);
        gl.compileShader(fragShader);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertShader);
        gl.attachShader(this.program, fragShader);
        gl.linkProgram(this.program);
        gl.useProgram(this.program);

        const vertices = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');
        this.uTime = gl.getUniformLocation(this.program, 'u_time');
        this.uMouse = gl.getUniformLocation(this.program, 'u_mouse');

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        this.time += 0.016;
        this.smoothMouse.x = lerp(this.smoothMouse.x, this.mouse.x, 0.03);
        this.smoothMouse.y = lerp(this.smoothMouse.y, this.mouse.y, 0.03);
        const gl = this.gl;
        gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uTime, this.time);
        gl.uniform2f(this.uMouse, this.smoothMouse.x, this.smoothMouse.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════
// II. PARTICLE CONSTELLATION SYSTEM
// ═══════════════════════════════════════════
class ParticleConstellation {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.connections = 150;
        this.particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: rand(0, this.canvas.width),
                y: rand(0, this.canvas.height),
                vx: rand(-0.3, 0.3),
                vy: rand(-0.3, 0.3),
                size: rand(1, 3),
                opacity: rand(0.2, 0.7),
                pulse: rand(0, Math.PI * 2),
                pulseSpeed: rand(0.01, 0.03),
                hue: rand(0, 1) > 0.5 ? rand(230, 270) : rand(300, 340) // Indigo or Pink
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update & draw particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += p.pulseSpeed;

            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse repulsion/attraction
            const d = dist(p.x, p.y, this.mouse.x, this.mouse.y);
            if (d < 200) {
                const force = (200 - d) / 200;
                const angle = Math.atan2(p.y - this.mouse.y, p.x - this.mouse.x);
                p.vx += Math.cos(angle) * force * 0.15;
                p.vy += Math.sin(angle) * force * 0.15;
            }

            // Friction
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Draw particle with pulse
            const pulseSize = p.size + Math.sin(p.pulse) * 0.5;
            const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${pulseOpacity})`;
            this.ctx.fill();

            // Glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, pulseSize * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${pulseOpacity * 0.1})`;
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const d = dist(this.particles[i].x, this.particles[i].y,
                              this.particles[j].x, this.particles[j].y);
                if (d < this.connections) {
                    const opacity = (1 - d / this.connections) * 0.25;
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `hsla(${this.particles[i].hue}, 60%, 60%, ${opacity})`);
                    gradient.addColorStop(1, `hsla(${this.particles[j].hue}, 60%, 60%, ${opacity})`);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Mouse connections
            const md = dist(this.particles[i].x, this.particles[i].y, this.mouse.x, this.mouse.y);
            if (md < 200) {
                const opacity = (1 - md / 200) * 0.4;
                this.ctx.beginPath();
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.strokeStyle = `hsla(${this.particles[i].hue}, 80%, 70%, ${opacity})`;
                this.ctx.lineWidth = 0.8;
                this.ctx.stroke();
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════
// III. CURSOR TRAIL SYSTEM (Ethereal Light Trail)
// ═══════════════════════════════════════════
class CursorTrail {
    constructor() {
        if (window.innerWidth < 768) return;
        this.canvas = document.getElementById('trail-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.trail = [];
        this.maxTrail = 35;
        this.mouse = { x: -100, y: -100 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.trail.push({
                x: e.clientX,
                y: e.clientY,
                life: 1,
                size: rand(2, 5),
                hue: rand(240, 320)
            });
            if (this.trail.length > this.maxTrail) this.trail.shift();
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw trail as connected path with gradient
        if (this.trail.length > 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.trail[0].x, this.trail[0].y);

            for (let i = 1; i < this.trail.length - 1; i++) {
                const xc = (this.trail[i].x + this.trail[i + 1].x) / 2;
                const yc = (this.trail[i].y + this.trail[i + 1].y) / 2;
                this.ctx.quadraticCurveTo(this.trail[i].x, this.trail[i].y, xc, yc);
            }

            const gradient = this.ctx.createLinearGradient(
                this.trail[0].x, this.trail[0].y,
                this.trail[this.trail.length - 1].x, this.trail[this.trail.length - 1].y
            );
            gradient.addColorStop(0, 'hsla(260, 80%, 60%, 0)');
            gradient.addColorStop(0.5, 'hsla(280, 80%, 65%, 0.3)');
            gradient.addColorStop(1, 'hsla(320, 80%, 70%, 0.5)');

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        }

        // Draw glow points
        this.trail.forEach((point, i) => {
            point.life -= 0.03;
            if (point.life <= 0) return;

            const progress = i / this.trail.length;
            const size = point.size * point.life * progress;
            const alpha = point.life * progress * 0.6;

            // Outer glow
            const glow = this.ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 4);
            glow.addColorStop(0, `hsla(${point.hue}, 80%, 70%, ${alpha * 0.3})`);
            glow.addColorStop(1, `hsla(${point.hue}, 80%, 70%, 0)`);
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, size * 4, 0, Math.PI * 2);
            this.ctx.fillStyle = glow;
            this.ctx.fill();

            // Core
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${point.hue}, 90%, 80%, ${alpha})`;
            this.ctx.fill();
        });

        // Remove dead particles
        this.trail = this.trail.filter(p => p.life > 0);

        requestAnimationFrame(() => this.animate());
    }
}

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
// V. FLOATING GEOMETRIC SHAPES
// ═══════════════════════════════════════════
class FloatingGeometry {
    constructor() {
        this.container = document.getElementById('geo-container');
        if (!this.container) return;
        this.shapes = [];
        this.mouse = { x: 0, y: 0 };
        this.createShapes();

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        this.animate();
    }

    createShapes() {
        const svgShapes = [
            // Triangle
            `<svg viewBox="0 0 60 60"><polygon points="30,5 55,50 5,50" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
            // Diamond
            `<svg viewBox="0 0 60 60"><polygon points="30,5 55,30 30,55 5,30" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
            // Circle
            `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
            // Hexagon
            `<svg viewBox="0 0 60 60"><polygon points="30,5 52,17 52,42 30,55 8,42 8,17" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
            // Cross
            `<svg viewBox="0 0 60 60"><path d="M30 10 L30 50 M10 30 L50 30" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
            // Square
            `<svg viewBox="0 0 60 60"><rect x="10" y="10" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1" transform="rotate(45 30 30)"/></svg>`
        ];

        const count = Math.min(12, Math.floor(window.innerWidth / 120));

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'floating-geo';
            el.innerHTML = svgShapes[Math.floor(rand(0, svgShapes.length))];
            
            const size = rand(20, 50);
            const x = rand(5, 95);
            const y = rand(5, 95);
            const depth = rand(0.2, 1);
            const speed = rand(15, 45);
            const rotSpeed = rand(20, 60);
            const delay = rand(0, 10);

            el.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${x}%; top: ${y}%;
                opacity: ${depth * 0.15};
                color: hsl(${rand(230, 330)}, 60%, 65%);
                animation: geoFloat ${speed}s ease-in-out ${delay}s infinite, geoSpin ${rotSpeed}s linear ${delay}s infinite;
            `;

            el.dataset.depth = depth;
            this.container.appendChild(el);
            this.shapes.push({ el, depth, baseX: x, baseY: y });
        }
    }

    animate() {
        this.shapes.forEach(shape => {
            const moveX = this.mouse.x * shape.depth * 20;
            const moveY = this.mouse.y * shape.depth * 20;
            shape.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
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
// XXIV. AMBIENT SOUND WAVES (Visual-only)
// ═══════════════════════════════════════════
class AmbientWaves {
    constructor() {
        this.container = document.getElementById('wave-container');
        if (!this.container) return;
        this.createWaves();
    }

    createWaves() {
        for (let i = 0; i < 4; i++) {
            const wave = document.createElement('div');
            wave.className = 'ambient-wave';
            wave.style.animationDelay = (i * 2) + 's';
            wave.style.animationDuration = (8 + i * 3) + 's';
            wave.style.opacity = 0.03 - i * 0.005;
            this.container.appendChild(wave);
        }
    }
}

// ═══════════════════════════════════════════
// XXV. INITIALIZE THE AURA ENGINE
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';

    // ── Core Systems ──
    new CinematicLoader();
    new AuroraShader();
    new Navigation();
    new ScrollProgress();

    // ── Unique Visual Systems ──
    new ParticleConstellation();
    new CursorTrail();
    new ClickRipple();
    new FloatingGeometry();
    new AmbientWaves();

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

    console.log('%c✦ THE AURA ENGINE v5.0 — JAYAPRAKASH K', 
        'background: linear-gradient(135deg, #6366f1, #ec4899); color: white; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 8px;');
    console.log('%c"No one in the world can replicate this."', 
        'color: #8b5cf6; font-style: italic; padding: 4px;');
});
