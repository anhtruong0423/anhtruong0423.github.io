/* ========================================
   LOST SIGNAL — Phase 1: Signal Scanner
   ======================================== */

class SignalScanner {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.radar = container.querySelector('.radar');
    this.statusEl = container.querySelector('.scanner-status');
    this.progressFill = container.querySelector('.scanner-progress__fill');
    this.progressValue = container.querySelector('.scanner-progress__value');
    this.fragmentEl = container.querySelector('.scanner-fragment');
    this.continueBtn = container.querySelector('.btn-continue');

    // Signal target positions (random each time)
    this.signals = this.generateSignals(3);
    this.foundCount = 0;
    this.totalSignals = this.signals.length;
    this.scanning = false;
    this.completed = false;

    this.init();
  }

  generateSignals(count) {
    const signals = [];
    for (let i = 0; i < count; i++) {
      signals.push({
        x: 15 + Math.random() * 70, // percentage
        y: 15 + Math.random() * 70,
        found: false,
        radius: 12, // detection radius %
      });
    }
    return signals;
  }

  init() {
    // Mouse/touch move on radar
    this.radar.addEventListener('mousemove', (e) => this.onRadarMove(e));
    this.radar.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onRadarMove(touch);
    }, { passive: false });

    this.radar.addEventListener('click', (e) => this.onRadarClick(e));

    // Continue button
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        window.audioEngine?.beep(800, 0.1);
        window.glitchEngine?.burst(300);
        setTimeout(() => this.onComplete(), 400);
      });
    }

    this.updateStatus('Di chuyển chuột trên radar để quét tín hiệu...');
  }

  getRelativePos(e) {
    const rect = this.radar.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  onRadarMove(e) {
    if (this.completed) return;
    const pos = this.getRelativePos(e);
    
    // Check proximity to unfound signals
    this.signals.forEach((sig, i) => {
      if (sig.found) return;
      const dist = Math.hypot(pos.x - sig.x, pos.y - sig.y);
      
      if (dist < sig.radius * 2) {
        // Near signal - show hint
        this.showHintRing(sig.x, sig.y);
        if (dist < sig.radius) {
          this.updateStatus('⚡ TÍN HIỆU PHÁT HIỆN — NHẤN ĐỂ KHÓA', true);
          // Show blip
          this.showBlip(sig.x, sig.y, i);
          window.audioEngine?.scannerPing();
        }
      }
    });
  }

  onRadarClick(e) {
    if (this.completed) return;
    const pos = this.getRelativePos(e);
    
    this.signals.forEach((sig, i) => {
      if (sig.found) return;
      const dist = Math.hypot(pos.x - sig.x, pos.y - sig.y);
      
      if (dist < sig.radius) {
        this.lockSignal(i);
      }
    });
  }

  lockSignal(index) {
    const sig = this.signals[index];
    if (sig.found) return;
    sig.found = true;
    this.foundCount++;

    // Visual feedback
    const blip = this.radar.querySelector(`.radar__blip[data-index="${index}"]`);
    if (blip) {
      blip.classList.remove('detected');
      blip.classList.add('locked');
    }

    // Sound
    window.audioEngine?.successChime();
    window.glitchEngine?.burst(200);

    // Update progress
    const pct = (this.foundCount / this.totalSignals) * 100;
    if (this.progressFill) this.progressFill.style.width = pct + '%';
    if (this.progressValue) this.progressValue.textContent = Math.round(pct) + '%';

    this.updateStatus(`Tín hiệu ${this.foundCount}/${this.totalSignals} đã khóa ✓`);

    // Update app state
    window.app?.updateSignalStrength(Math.round(pct / 3));
    window.app?.updateIntegrity(5 + this.foundCount * 8);

    // Check completion
    if (this.foundCount >= this.totalSignals) {
      this.completed = true;
      setTimeout(() => this.onScanComplete(), 800);
    }
  }

  showBlip(x, y, index) {
    let blip = this.radar.querySelector(`.radar__blip[data-index="${index}"]`);
    if (!blip) {
      blip = document.createElement('div');
      blip.className = 'radar__blip';
      blip.dataset.index = index;
      blip.style.left = x + '%';
      blip.style.top = y + '%';
      this.radar.appendChild(blip);
    }
    blip.classList.add('detected');
  }

  showHintRing(x, y) {
    // Remove old hint
    const old = this.radar.querySelector('.radar__hint-ring');
    if (old) old.remove();

    const ring = document.createElement('div');
    ring.className = 'radar__hint-ring';
    ring.style.left = x + '%';
    ring.style.top = y + '%';
    this.radar.appendChild(ring);

    setTimeout(() => ring.remove(), 2000);
  }

  updateStatus(text, found = false) {
    if (this.statusEl) {
      this.statusEl.textContent = text;
      this.statusEl.className = 'scanner-status' + (found ? ' found' : '');
    }
  }

  onScanComplete() {
    this.updateStatus('✓ TẤT CẢ TÍN HIỆU ĐÃ ĐƯỢC KHÓA — FRAGMENT ĐÃ TRUY XUẤT');

    // Show fragment preview
    if (this.fragmentEl) {
      this.fragmentEl.classList.add('visible');
    }

    // Show continue button
    if (this.continueBtn) {
      setTimeout(() => {
        this.continueBtn.classList.add('visible');
      }, 1000);
    }
  }
}

window.SignalScanner = SignalScanner;
