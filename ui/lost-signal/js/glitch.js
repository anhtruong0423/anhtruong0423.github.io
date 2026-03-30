/* ========================================
   LOST SIGNAL — Glitch Engine (Canvas)
   ======================================== */

class GlitchEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.intensity = 0.8; // 0 = clean, 1 = max glitch
    this.running = false;
    this.frameId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setIntensity(val) {
    this.intensity = Math.max(0, Math.min(1, val));
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.render();
  }

  stop() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    if (!this.running) return;

    const { ctx, canvas, intensity } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (intensity < 0.02) {
      this.frameId = requestAnimationFrame(() => this.render());
      return;
    }

    // 1. Random glitch blocks
    if (Math.random() < intensity * 0.3) {
      const numBlocks = Math.floor(intensity * 8);
      for (let i = 0; i < numBlocks; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const bw = 20 + Math.random() * (w * 0.3 * intensity);
        const bh = 2 + Math.random() * (10 * intensity);
        
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '0,255,65' : '255,0,64'}, ${0.03 + Math.random() * 0.08 * intensity})`;
        ctx.fillRect(x, y, bw, bh);
      }
    }

    // 2. Horizontal shift lines
    if (Math.random() < intensity * 0.2) {
      const y = Math.random() * h;
      const lineH = 1 + Math.random() * 4;
      const shift = (Math.random() - 0.5) * 20 * intensity;
      
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(0, 240, 255, ${0.05 * intensity})`;
      ctx.fillRect(shift, y, w, lineH);
      ctx.restore();
    }

    // 3. RGB channel split simulation
    if (Math.random() < intensity * 0.1) {
      const splitAmount = intensity * 5;
      
      // Red channel ghost
      ctx.fillStyle = `rgba(255, 0, 0, ${0.02 * intensity})`;
      ctx.fillRect(splitAmount, 0, w, h);
      
      // Cyan channel ghost
      ctx.fillStyle = `rgba(0, 255, 255, ${0.02 * intensity})`;
      ctx.fillRect(-splitAmount, 0, w, h);
    }

    // 4. Static noise dots
    if (intensity > 0.3) {
      const numDots = Math.floor(intensity * 50);
      for (let i = 0; i < numDots; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const brightness = Math.random();
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.1 * intensity})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // 5. Full-screen interference flash (rare)
    if (Math.random() < intensity * 0.02) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.05})`;
      ctx.fillRect(0, 0, w, h);
    }

    // 6. Vertical tear line
    if (Math.random() < intensity * 0.05) {
      const x = Math.random() * w;
      ctx.strokeStyle = `rgba(0, 255, 65, ${0.1 * intensity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let yPos = 0;
      while (yPos < h) {
        yPos += 5 + Math.random() * 20;
        ctx.lineTo(x + (Math.random() - 0.5) * 10 * intensity, yPos);
      }
      ctx.stroke();
    }

    this.frameId = requestAnimationFrame(() => this.render());
  }

  // One-shot glitch burst
  burst(duration = 300) {
    const origIntensity = this.intensity;
    this.intensity = 1;
    setTimeout(() => {
      this.intensity = origIntensity;
    }, duration);
  }

  // Smooth transition
  transitionTo(targetIntensity, duration = 1000) {
    const start = this.intensity;
    const diff = targetIntensity - start;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      this.intensity = start + diff * eased;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
}

// Export globally
window.GlitchEngine = GlitchEngine;
