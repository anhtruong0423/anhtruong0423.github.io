/* ========================================
   LOST SIGNAL — Phase 5: The Revelation
   ======================================== */

class Revelation {
  constructor(container) {
    this.container = container;
    this.videoPlayer = container.querySelector('.video-player');
    this.videoCanvas = container.querySelector('.video-player__canvas');
    this.videoCtx = this.videoCanvas?.getContext('2d');
    this.timecodeEl = container.querySelector('.video-player__timecode');
    this.messageEl = container.querySelector('.reveal-message');
    this.creditsEl = container.querySelector('.reveal-credits');
    this.animFrame = null;
    this.startTime = 0;
  }

  start() {
    // Signal restored banner
    const banner = document.querySelector('.signal-restored');
    if (banner) {
      banner.classList.add('visible');
      window.audioEngine?.revelationSweep();
    }

    // After banner fades
    setTimeout(() => {
      this.showVideoPlayer();
    }, 3500);
  }

  showVideoPlayer() {
    // Show player
    if (this.videoPlayer) {
      this.videoPlayer.classList.add('visible');
      this.resizeCanvas();
      this.startTime = performance.now();
      this.renderVideo();
    }

    // Reveal message after video "plays"
    setTimeout(() => {
      this.showMessage();
    }, 3000);

    // Credits
    setTimeout(() => {
      if (this.creditsEl) this.creditsEl.classList.add('visible');
    }, 5000);
  }

  resizeCanvas() {
    if (!this.videoCanvas) return;
    const rect = this.videoCanvas.parentElement.getBoundingClientRect();
    this.videoCanvas.width = rect.width;
    this.videoCanvas.height = rect.height;
  }

  renderVideo() {
    if (!this.videoCtx) return;
    const ctx = this.videoCtx;
    const w = this.videoCanvas.width;
    const h = this.videoCanvas.height;
    const elapsed = (performance.now() - this.startTime) / 1000;

    ctx.clearRect(0, 0, w, h);

    // Cinematic "recovered footage" effect
    // Background gradient
    const phase = elapsed * 0.3;
    const hue1 = (200 + Math.sin(phase) * 40) % 360;
    const hue2 = (280 + Math.cos(phase * 0.7) * 30) % 360;
    
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `hsla(${hue1}, 60%, 8%, 1)`);
    grad.addColorStop(0.5, `hsla(${(hue1 + hue2) / 2}, 40%, 12%, 1)`);
    grad.addColorStop(1, `hsla(${hue2}, 50%, 6%, 1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Floating light particles
    for (let i = 0; i < 15; i++) {
      const px = (Math.sin(elapsed * 0.5 + i * 2.1) * 0.3 + 0.5) * w;
      const py = (Math.cos(elapsed * 0.3 + i * 1.7) * 0.3 + 0.5) * h;
      const size = 1 + Math.sin(elapsed + i) * 0.5;
      const alpha = 0.1 + Math.sin(elapsed * 0.8 + i * 0.5) * 0.1;
      
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.fill();
    }

    // Cinematic text that emerges
    if (elapsed > 1) {
      const textAlpha = Math.min(1, (elapsed - 1) * 0.5);
      ctx.font = `${Math.min(w * 0.04, 24)}px 'Orbitron', sans-serif`;
      ctx.fillStyle = `rgba(0, 255, 65, ${textAlpha * 0.6})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(0, 255, 65, ${textAlpha * 0.4})`;
      ctx.fillText('SIGNAL RESTORED', w / 2, h * 0.35);
      ctx.shadowBlur = 0;

      if (elapsed > 2.5) {
        const subAlpha = Math.min(1, (elapsed - 2.5) * 0.5);
        ctx.font = `${Math.min(w * 0.025, 16)}px 'Space Mono', monospace`;
        ctx.fillStyle = `rgba(200, 200, 208, ${subAlpha * 0.8})`;
        ctx.fillText('Mọi mảnh ghép đã được khôi phục', w / 2, h * 0.5);
        ctx.fillText('Tín hiệu này... là dành cho bạn', w / 2, h * 0.58);
      }
    }

    // Subtle scanline
    for (let y = 0; y < h; y += 3) {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.03 + Math.sin(y + elapsed * 10) * 0.01})`;
      ctx.fillRect(0, y, w, 1);
    }

    // Timecode
    if (this.timecodeEl) {
      const mins = Math.floor(elapsed / 60);
      const secs = Math.floor(elapsed % 60);
      const frames = Math.floor((elapsed % 1) * 24);
      this.timecodeEl.textContent = 
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
    }

    this.animFrame = requestAnimationFrame(() => this.renderVideo());
  }

  showMessage() {
    if (this.messageEl) {
      this.messageEl.classList.add('visible');
    }

    // Create dissolve particles
    this.createDissolveParticles();
  }

  createDissolveParticles() {
    const container = document.querySelector('.dissolve-particles');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'dissolve-particle';
        particle.style.left = (20 + Math.random() * 60) + '%';
        particle.style.top = (30 + Math.random() * 40) + '%';
        particle.style.setProperty('--dx', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--dy', -(50 + Math.random() * 150) + 'px');
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
        
        const colors = ['rgba(0,255,65,0.8)', 'rgba(0,240,255,0.6)', 'rgba(180,74,255,0.5)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 4000);
      }, i * 100);
    }
  }

  stop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}

window.Revelation = Revelation;
