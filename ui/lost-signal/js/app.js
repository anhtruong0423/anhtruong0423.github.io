/* ========================================
   LOST SIGNAL — Main App Controller
   ======================================== */

class LostSignalApp {
  constructor() {
    this.currentPhase = -1; // -1 = not started
    this.phases = ['boot', 'scanner', 'repair', 'decode', 'memory', 'reveal'];
    this.signalStrength = 0;
    this.dataIntegrity = 0;

    // DOM refs
    this.hud = document.getElementById('hud');
    this.signalSegments = document.querySelectorAll('.signal-bar__segment');
    this.integrityFill = document.querySelector('.integrity-bar__fill');
    this.integrityText = document.getElementById('integrity-text');
    this.phaseDots = document.querySelectorAll('.phase-dot');
    this.phaseLabel = document.getElementById('phase-label');
    this.glitchCanvas = document.getElementById('glitch-canvas');

    // Module instances
    this.modules = {};

    // Initialize
    this.init();
  }

  init() {
    // Setup glitch engine
    if (this.glitchCanvas) {
      window.glitchEngine = new GlitchEngine(this.glitchCanvas);
      window.glitchEngine.setIntensity(0.8);
      window.glitchEngine.start();
    }

    // Start with boot phase
    this.goToPhase(0);
  }

  goToPhase(index) {
    if (index < 0 || index >= this.phases.length) return;

    // Deactivate current phase
    if (this.currentPhase >= 0) {
      const currentEl = document.getElementById(`phase-${this.phases[this.currentPhase]}`);
      if (currentEl) currentEl.classList.remove('active');
      
      // Mark dot as completed
      if (this.phaseDots[this.currentPhase]) {
        this.phaseDots[this.currentPhase].classList.remove('current');
        this.phaseDots[this.currentPhase].classList.add('completed');
      }
    }

    this.currentPhase = index;

    // Activate new phase
    const newEl = document.getElementById(`phase-${this.phases[index]}`);
    if (newEl) {
      newEl.classList.add('active');
    }

    // Update dot
    if (this.phaseDots[index]) {
      this.phaseDots[index].classList.add('current');
    }

    // Update phase label
    if (this.phaseLabel) {
      const labels = [
        'BOOT SEQUENCE', 'SIGNAL SCAN', 'IMAGE REPAIR', 
        'AUDIO DECODE', 'MEMORY REBUILD', 'REVELATION'
      ];
      this.phaseLabel.textContent = labels[index] || '';
    }

    // Show HUD after boot
    if (index > 0 && this.hud) {
      this.hud.classList.add('visible');
    }

    // Initialize phase module
    this.initPhase(index);
  }

  initPhase(index) {
    const phaseName = this.phases[index];
    const container = document.getElementById(`phase-${phaseName}`);
    if (!container) return;

    switch (phaseName) {
      case 'boot':
        this.modules.boot = new BootSequence(container, () => {
          this.goToPhase(1);
        });
        this.modules.boot.start();
        break;

      case 'scanner':
        window.glitchEngine?.transitionTo(0.6, 1000);
        this.modules.scanner = new SignalScanner(container, () => {
          this.goToPhase(2);
        });
        break;

      case 'repair':
        window.glitchEngine?.transitionTo(0.5, 500);
        this.modules.repair = new ImageRepair(container, () => {
          this.goToPhase(3);
        });
        break;

      case 'decode':
        window.glitchEngine?.transitionTo(0.35, 500);
        this.modules.decode = new AudioDecode(container, () => {
          this.goToPhase(4);
        });
        break;

      case 'memory':
        window.glitchEngine?.transitionTo(0.15, 500);
        this.modules.memory = new MemoryReconstruction(container, () => {
          this.goToPhase(5);
        });
        break;

      case 'reveal':
        window.glitchEngine?.transitionTo(0, 2000);
        this.updateSignalStrength(100);
        this.updateIntegrity(100);
        this.modules.reveal = new Revelation(container);
        this.modules.reveal.start();
        // Hide HUD for cinematic feel
        setTimeout(() => {
          if (this.hud) this.hud.classList.remove('visible');
        }, 3000);
        break;
    }
  }

  updateSignalStrength(value) {
    this.signalStrength = Math.max(0, Math.min(100, value));
    const activeSegments = Math.round((this.signalStrength / 100) * 6);
    this.signalSegments.forEach((seg, i) => {
      seg.classList.toggle('active', i < activeSegments);
      seg.classList.toggle('warning', activeSegments > 0 && activeSegments <= 2);
    });
  }

  updateIntegrity(value) {
    this.dataIntegrity = Math.max(0, Math.min(100, value));
    if (this.integrityFill) {
      this.integrityFill.style.width = this.dataIntegrity + '%';
    }
    if (this.integrityText) {
      this.integrityText.textContent = Math.round(this.dataIntegrity) + '%';
      this.integrityText.className = 'hud__value' + 
        (this.dataIntegrity < 30 ? ' hud__value--danger' : 
         this.dataIntegrity < 60 ? ' hud__value--warning' : '');
    }
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new LostSignalApp();
});
