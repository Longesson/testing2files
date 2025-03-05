// Canvas setup
const canvas = document.getElementById('bouncingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 300;

// Animation types
let currentAnimation = 'bouncing';
let particles = [];
let stars = [];
let waves = [];

// Particle class for explosion effect
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.life = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
        ctx.fill();
    }
}

// Star class for starfield effect
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 2 + 1;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }
}

// Wave class for wave effect
class Wave {
    constructor(y) {
        this.y = y;
        this.amplitude = 20;
        this.frequency = 0.02;
        this.speed = 0.05;
        this.offset = 0;
    }

    update() {
        this.offset += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        for (let x = 0; x < canvas.width; x++) {
            const y = this.y + Math.sin(x * this.frequency + this.offset) * this.amplitude;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#00ffff';
        ctx.stroke();
    }
}

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8;
        this.dy = (Math.random() - 0.5) * 8;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

// Create initial balls
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
const balls = [];
for (let i = 0; i < 10; i++) {
    const radius = 15;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = colors[Math.floor(Math.random() * colors.length)];
    balls.push(new Ball(x, y, radius, color));
}

// Create initial stars
for (let i = 0; i < 50; i++) {
    stars.push(new Star());
}

// Create initial waves
for (let i = 0; i < 3; i++) {
    waves.push(new Wave(100 + i * 50));
}

// Button click handlers
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const text = button.textContent;
        
        // Reset all animations
        particles = [];
        stars = [];
        waves = [];
        
        if (text === 'Enter Site') {
            currentAnimation = 'particles';
            // Create explosion particles
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle(canvas.width/2, canvas.height/2, '255, 255, 255'));
            }
        } else if (text === 'Guestbook') {
            currentAnimation = 'waves';
            // Create waves
            for (let i = 0; i < 3; i++) {
                waves.push(new Wave(100 + i * 50));
            }
        } else if (text === 'Cool Links') {
            currentAnimation = 'starfield';
            // Create stars
            for (let i = 0; i < 50; i++) {
                stars.push(new Star());
            }
        }
    });
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch(currentAnimation) {
        case 'bouncing':
            balls.forEach(ball => ball.update());
            break;
        case 'particles':
            particles = particles.filter(particle => particle.life > 0);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            break;
        case 'starfield':
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            break;
        case 'waves':
            waves.forEach(wave => {
                wave.update();
                wave.draw();
            });
            break;
    }
    
    requestAnimationFrame(animate);
}

animate(); 