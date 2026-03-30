/* ========================================
   LOST SIGNAL — Phase 3: Audio Decode
   ======================================== */

class AudioDecode {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.oscilloscopeCanvas = container.querySelector('.oscilloscope__canvas');
    this.osCtx = this.oscilloscopeCanvas?.getContext('2d');
    this.matchDisplay = container.querySelector('.oscilloscope__match');
    this.continueBtn = container.querySelector('.btn-continue');

    // Three frequency knobs with target values
    this.knobs = [
      { el: null, value: 0, target: 120 + Math.floor(Math.random() * 60), matched: false, label: 'FREQ-A' },
      { el: null, value: 0, target: 200 + Math.floor(Math.random() * 80), matched: false, label: 'FREQ-B' },
      { el: null, value: 0, target: 300 + Math.floor(Math.random() * 100), matched: false, label: 'FREQ-C' },
    ];

    this.matchedCount = 0;
    this.activeKnob = null;
    this.startAngle = 0;
    this.animFrame = null;

    this.init();
  }

  init() {
    // Setup knobs
    const knobEls = this.container.querySelectorAll('.knob');
    const valueEls = this.container.querySelectorAll('.knob-value');
    const dotEls = this.container.querySelectorAll('.freq-match__dot');

    knobEls.forEach((el, i) => {
      if (this.knobs[i]) {
        this.knobs[i].el = el;
        this.knobs[i].valueEl = valueEls[i];
        this.knobs[i].dotEl = dotEls[i];
        this.knobs[i].indicatorEl = el.querySelector('.knob__indicator');
        
        // Random starting position
        this.knobs[i].value = Math.floor(Math.random() * 500);
        this.updateKnobDisplay(i);
      }
    });

    // Knob interaction
    this.setupKnobInteraction();

    // Start oscilloscope
    this.resizeOscilloscope();
    window.addEventListener('resize', () => this.resizeOscilloscope());
    this.startOscilloscope();

    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        this.stopOscilloscope();
        window.audioEngine?.beep(800, 0.1);
        window.glitchEngine?.burst(300);
        setTimeout(() => this.onComplete(), 400);
      });
    }
  }

  resizeOscilloscope() {
    if (!this.oscilloscopeCanvas) return;
    const rect = this.oscilloscopeCanvas.parentElement.getBoundingClientRect();
    this.oscilloscopeCanvas.width = rect.width;
    this.oscilloscopeCanvas.height = rect.height;
  }

  setupKnobInteraction() {
    this.knobs.forEach((knob, i) => {
      if (!knob.el) return;

      // Mouse
      knob.el.addEventListener('mousedown', (e) => {
        if (knob.matched) return;
        this.activeKnob = i;
        knob.el.classList.add('active');
        this.startAngle = this.getAngle(e, knob.el);
        e.preventDefault();
      });

      // Touch
      knob.el.addEventListener('touchstart', (e) => {
        if (knob.matched) return;
        this.activeKnob = i;
        knob.el.classList.add('active');
        this.startAngle = this.getAngle(e.touches[0], knob.el);
        e.preventDefault();
      });
    });

    // Global move/up
    document.addEventListener('mousemove', (e) => this.onKnobMove(e));
    document.addEventListener('mouseup', () => this.onKnobRelease());
    document.addEventListener('touchmove', (e) => {
      if (this.activeKnob !== null) this.onKnobMove(e.touches[0]);
    }, { passive: true });
    document.addEventListener('touchend', () => this.onKnobRelease());
  }

  getAngle(e, el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx);
  }

  onKnobMove(e) {
    if (this.activeKnob === null) return;
    const knob = this.knobs[this.activeKnob];
    
    const currentAngle = this.getAngle(e, knob.el);
    let delta = currentAngle - this.startAngle;
    
    // Normalize
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    // Convert to value change (1 full rotation = ~500 units)
    knob.value = Math.max(0, Math.min(500, knob.value + delta * 80));
    this.startAngle = currentAngle;

    this.updateKnobDisplay(this.activeKnob);
    this.checkMatch(this.activeKnob);

    // Play tone based on value
    if (Math.random() < 0.1) {
      window.audioEngine?.playFrequencyTone(100 + knob.value, 0.05);
    }
  }

  onKnobRelease() {
    if (this.activeKnob !== null) {
      const knob = this.knobs[this.activeKnob];
      knob.el.classList.remove('active');
      this.activeKnob = null;
    }
  }

  updateKnobDisplay(index) {
    const knob = this.knobs[index];
    if (!knob.el) return;

    // Rotate indicator
    const rotation = (knob.value / 500) * 300 - 150; // -150 to 150 degrees
    if (knob.indicatorEl) {
      knob.indicatorEl.style.transform = `rotate(${rotation}deg)`;
    }

    // Update value display
    if (knob.valueEl) {
      knob.valueEl.textContent = `${Math.round(knob.value)} Hz`;
    }
  }

  checkMatch(index) {
    const knob = this.knobs[index];
    const diff = Math.abs(knob.value - knob.target);
    const threshold = 15; // tolerance

    if (diff <= threshold && !knob.matched) {
      knob.matched = true;
      knob.value = knob.target; // Snap
      this.updateKnobDisplay(index);
      
      knob.el.classList.add('matched');
      if (knob.valueEl) {
        knob.valueEl.classList.add('matched');
        knob.valueEl.textContent = `${knob.target} Hz ✓`;
      }
      if (knob.dotEl) knob.dotEl.classList.add('active');

      this.matchedCount++;
      window.audioEngine?.successChime();

      // Update app
      window.app?.updateIntegrity(45 + this.matchedCount * 10);
      window.app?.updateSignalStrength(50 + this.matchedCount * 10);
      window.glitchEngine?.setIntensity(0.4 - this.matchedCount * 0.1);

      if (this.matchedCount >= 3) {
        setTimeout(() => this.onDecodeComplete(), 1000);
      }
    }
  }

  startOscilloscope() {
    this.oscRunning = true;
    this.renderOscilloscope();
  }

  stopOscilloscope() {
    this.oscRunning = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  renderOscilloscope() {
    if (!this.oscRunning || !this.osCtx) return;

    const ctx = this.osCtx;
    const w = this.oscilloscopeCanvas.width;
    const h = this.oscilloscopeCanvas.height;
    const time = performance.now() / 1000;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(5, 5, 8, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // Draw target wave (dim)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x++) {
      const t = x / w;
      let y = h / 2;
      this.knobs.forEach(k => {
        y += Math.sin(t * k.target * 0.05 + time * 2) * 15;
      });
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw current wave
    ctx.beginPath();
    ctx.strokeStyle = this.matchedCount >= 3 
      ? 'rgba(0, 255, 65, 0.8)' 
      : 'rgba(0, 240, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.matchedCount >= 3 
      ? 'rgba(0, 255, 65, 0.5)' 
      : 'rgba(0, 240, 255, 0.5)';

    for (let x = 0; x < w; x++) {
      const t = x / w;
      let y = h / 2;
      this.knobs.forEach(k => {
        const freq = k.value || 1;
        y += Math.sin(t * freq * 0.05 + time * 3) * (15 + Math.random() * (k.matched ? 1 : 5));
      });
      // Add noise if not all matched
      if (this.matchedCount < 3) {
        y += (Math.random() - 0.5) * 8 * (1 - this.matchedCount / 3);
      }
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Match display
    if (this.matchDisplay) {
      this.matchDisplay.textContent = `MATCH: ${this.matchedCount}/3`;
      this.matchDisplay.className = 'oscilloscope__match ' + 
        (this.matchedCount >= 3 ? 'text-green' : 
         this.matchedCount > 0 ? 'text-cyan' : 'text-dim');
    }

    this.animFrame = requestAnimationFrame(() => this.renderOscilloscope());
  }

  onDecodeComplete() {
    if (this.matchDisplay) {
      this.matchDisplay.textContent = 'AUDIO DECODED ✓';
      this.matchDisplay.className = 'oscilloscope__match text-green';
    }

    const progressText = this.container.querySelector('.decode-progress__text');
    if (progressText) {
      progressText.textContent = '✓ GIẢI MÃ HOÀN TẤT — ÂM THANH ĐÃ KHÔI PHỤC';
      progressText.classList.add('complete');
    }

    if (this.continueBtn) {
      setTimeout(() => this.continueBtn.classList.add('visible'), 500);
    }
  }
}

window.AudioDecode = AudioDecode;
