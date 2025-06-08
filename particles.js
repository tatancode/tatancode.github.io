class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.originalX = x;
        this.originalY = y;
        this.returning = false;
        this.opacity = 1;
        this.lifeTime = 3000; // 3 seconds
        this.createdAt = Date.now();
    }

    update(mouseX, mouseY) {
        // Calculate remaining lifetime
        const age = Date.now() - this.createdAt;
        this.opacity = Math.max(0, 1 - (age / this.lifeTime));

        // Add some random movement
        this.speedX += (Math.random() - 0.5) * 0.2;
        this.speedY += (Math.random() - 0.5) * 0.2;

        // Limit maximum speed
        this.speedX = Math.max(Math.min(this.speedX, 4), -4);
        this.speedY = Math.max(Math.min(this.speedY, 4), -4);

        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            this.returning = true;
            const angle = Math.atan2(dy, dx);
            const force = 0.1;
            this.speedX -= Math.cos(angle) * force;
            this.speedY -= Math.sin(angle) * force;
        } else {
            this.returning = false;
        }

        // Keep particles within canvas bounds
        if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    isDead() {
        return Date.now() - this.createdAt > this.lifeTime;
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isHovering = false;
        this.hoverTimeout = null;

        this.resize();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.x;
            this.mouseY = e.y;
        });

        const trigger = document.querySelector('.fade-text');
        trigger.classList.add('particle-trigger');

        trigger.addEventListener('mouseenter', (e) => {
            this.isHovering = true;
            this.explode(e.clientX, e.clientY);
        });

        trigger.addEventListener('mouseleave', () => {
            this.isHovering = false;
        });
    }

    explode(x, y) {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(x, y, '#000'));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.update(this.mouseX, this.mouseY);
            particle.draw(this.ctx);
            return !particle.isDead();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle system
new ParticleSystem();
console.log("Hi, I'm Seb!");
