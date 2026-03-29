/* ==========================================
   EFFECTS — Particles, Lens Flare, Film Grain
   ========================================== */

/**
 * Floating Particles (cherry blossom / confetti style)
 */
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 35;
    this.colors = [
      'rgba(255, 107, 107, 0.4)',  // coral
      'rgba(255, 169, 77, 0.35)',  // sunset
      'rgba(177, 151, 252, 0.3)', // lavender
      'rgba(247, 131, 172, 0.3)', // pink
      'rgba(99, 230, 190, 0.25)', // mint
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.init();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const shapes = ['circle', 'petal', 'star'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
      x: Math.random() * this.canvas.width,
      y: -20,
      size: Math.random() * 8 + 3,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1 + 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      opacity: Math.random() * 0.6 + 0.2,
      shape: shape,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  init() {
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.createParticle();
      p.y = Math.random() * this.canvas.height;
      this.particles.push(p);
    }
  }

  drawPetal(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.6, size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawStar(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
    }
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      // Update wobble
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Draw
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.strokeStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'petal') {
        this.drawPetal(this.ctx, p.x, p.y, p.size, p.rotation);
      } else {
        this.drawStar(this.ctx, p.x, p.y, p.size, p.rotation);
      }

      // Reset if out of screen
      if (p.y > this.canvas.height + 20 || p.x < -20 || p.x > this.canvas.width + 20) {
        this.particles[i] = this.createParticle();
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

/**
 * Spotlight cursor effect
 */
class SpotlightEffect {
  constructor() {
    this.spotlight = document.createElement('div');
    this.spotlight.classList.add('spotlight-overlay');
    document.body.appendChild(this.spotlight);

    document.addEventListener('mousemove', (e) => {
      document.body.style.setProperty('--mouse-x', e.clientX + 'px');
      document.body.style.setProperty('--mouse-y', e.clientY + 'px');
    });
  }
}

/**
 * Film Countdown
 */
class FilmCountdown {
  constructor(overlayId, numberId, onComplete) {
    this.overlay = document.getElementById(overlayId);
    this.numberEl = document.getElementById(numberId);
    this.onComplete = onComplete;
    this.count = 3;

    if (!this.overlay || !this.numberEl) {
      if (this.onComplete) this.onComplete();
      return;
    }

    this.start();
  }

  start() {
    this.numberEl.textContent = this.count;
    this.tick();
  }

  tick() {
    if (this.count <= 0) {
      this.overlay.classList.add('countdown-overlay--hidden');
      setTimeout(() => {
        this.overlay.style.display = 'none';
        if (this.onComplete) this.onComplete();
      }, 800);
      return;
    }

    this.numberEl.textContent = this.count;
    this.numberEl.style.transform = 'translate(-50%, -50%) scale(1.3)';
    this.numberEl.style.opacity = '1';

    setTimeout(() => {
      this.numberEl.style.transform = 'translate(-50%, -50%) scale(0.8)';
      this.numberEl.style.opacity = '0.3';
    }, 600);

    setTimeout(() => {
      this.count--;
      this.tick();
    }, 1000);
  }
}

// Initialize effects when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for countdown to finish, then start particles
  new FilmCountdown('countdown-overlay', 'countdown-number', () => {
    new ParticleSystem('particles-canvas');
    new SpotlightEffect();
  });
});
