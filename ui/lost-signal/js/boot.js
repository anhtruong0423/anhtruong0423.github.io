/* ========================================
   LOST SIGNAL — Phase 0: Boot Sequence
   ======================================== */

class BootSequence {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.body = container.querySelector('.boot-terminal__body');
    this.lineIndex = 0;
    this.lines = this.getBootLines();
  }

  getBootLines() {
    return [
      { text: '> LOST SIGNAL RECOVERY SYSTEM v3.7.1', cls: 'system', delay: 100 },
      { text: '> Copyright (c) 2026 — Signal Corp.', cls: 'system', delay: 80 },
      { text: '─'.repeat(50), cls: 'system', delay: 60 },
      { text: '', delay: 300 },
      { text: '[BOOT] Initializing kernel...', cls: 'system', delay: 200 },
      { text: '[BOOT] Loading memory modules... OK', cls: 'success', delay: 150 },
      { text: '[BOOT] Mounting file system... OK', cls: 'success', delay: 120 },
      { text: '[BOOT] Starting network daemon...', cls: 'system', delay: 200 },
      { text: '', delay: 200 },
      { text: '[NET] Scanning available frequencies...', cls: 'system', delay: 300 },
      { text: '[NET] Channel 1 (87.5 MHz) — NO SIGNAL', cls: 'warning', delay: 100 },
      { text: '[NET] Channel 2 (102.3 MHz) — NO SIGNAL', cls: 'warning', delay: 100 },
      { text: '[NET] Channel 3 (145.7 MHz) — NO SIGNAL', cls: 'warning', delay: 100 },
      { text: '[NET] Channel 4 (203.1 MHz) — WEAK SIGNAL DETECTED ◈', cls: 'highlight', delay: 400 },
      { text: '', delay: 200 },
      { text: '[SIG] Attempting to lock signal...', cls: 'system', delay: 300 },
      { type: 'progress', delay: 30 },
      { text: '', delay: 200 },
      { text: '[SIG] Signal partially acquired', cls: 'success', delay: 200 },
      { text: '[SIG] Analyzing data stream...', cls: 'system', delay: 300 },
      { text: '', delay: 300 },
      { text: '██ WARNING ██████████████████████████████████', cls: 'error', delay: 100 },
      { text: '█                                           █', cls: 'error', delay: 50 },
      { text: '█   DATA CORRUPTION DETECTED: 87.3%         █', cls: 'error', delay: 150 },
      { text: '█   VIDEO FRAGMENTS: SCATTERED               █', cls: 'error', delay: 100 },
      { text: '█   AUDIO STREAM: ENCRYPTED                  █', cls: 'error', delay: 100 },
      { text: '█   TIMELINE: DISRUPTED                      █', cls: 'error', delay: 100 },
      { text: '█                                           █', cls: 'error', delay: 50 },
      { text: '█████████████████████████████████████████████', cls: 'error', delay: 200 },
      { text: '', delay: 400 },
      { text: '[SYS] Manual recovery required.', cls: 'warning', delay: 200 },
      { text: '[SYS] Operator intervention needed to restore signal.', cls: 'warning', delay: 200 },
      { text: '', delay: 300 },
      { text: '> Awaiting operator command...', cls: 'highlight', delay: 200 },
      { type: 'button', delay: 300 },
    ];
  }

  start() {
    this.processNext();
  }

  processNext() {
    if (this.lineIndex >= this.lines.length) return;

    const line = this.lines[this.lineIndex];
    this.lineIndex++;

    if (line.type === 'progress') {
      this.showProgress(() => {
        setTimeout(() => this.processNext(), 200);
      });
    } else if (line.type === 'button') {
      this.showEnterButton();
    } else {
      this.addLine(line.text, line.cls);
      // Play sound effects
      if (line.cls === 'error') {
        window.audioEngine?.beep(200, 0.05, 'square');
      } else if (line.cls === 'success') {
        window.audioEngine?.beep(800, 0.03, 'sine');
      } else if (line.cls === 'highlight') {
        window.audioEngine?.beep(1200, 0.05, 'sine');
      }
      setTimeout(() => this.processNext(), line.delay || 100);
    }

    // Auto scroll
    this.body.scrollTop = this.body.scrollHeight;
  }

  addLine(text, cls = 'system') {
    const div = document.createElement('div');
    div.className = `boot-line boot-line--${cls}`;
    div.textContent = text;
    this.body.appendChild(div);
    // Trigger reflow for animation
    requestAnimationFrame(() => div.classList.add('visible'));
  }

  showProgress(callback) {
    const wrapper = document.createElement('div');
    wrapper.className = 'boot-progress boot-line visible';
    wrapper.innerHTML = `
      <span class="boot-line--system">[SIG] Locking: </span>
      <div class="boot-progress__bar">
        <div class="boot-progress__fill" id="boot-progress-fill"></div>
      </div>
      <span class="boot-progress__text" id="boot-progress-text">0%</span>
    `;
    this.body.appendChild(wrapper);

    const fill = wrapper.querySelector('#boot-progress-fill');
    const text = wrapper.querySelector('#boot-progress-text');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 5 + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        fill.style.width = '100%';
        text.textContent = '100%';
        text.style.color = 'var(--col-neon-green)';
        window.audioEngine?.beep(1000, 0.1, 'sine');
        callback();
      } else {
        fill.style.width = progress + '%';
        text.textContent = Math.floor(progress) + '%';
        if (Math.random() < 0.1) {
          window.audioEngine?.beep(400 + Math.random() * 300, 0.02, 'square');
        }
      }
    }, 30);
  }

  showEnterButton() {
    const wrapper = document.createElement('div');
    wrapper.className = 'boot-enter';
    wrapper.innerHTML = `
      <button class="boot-enter__btn" id="boot-enter-btn">
        ▶ INITIATE RECOVERY
      </button>
      <p class="boot-enter__hint">Nhấn để bắt đầu khôi phục tín hiệu</p>
    `;
    this.body.appendChild(wrapper);

    const btn = wrapper.querySelector('#boot-enter-btn');
    btn.addEventListener('click', () => {
      window.audioEngine?.init();
      window.audioEngine?.beep(600, 0.1, 'sine');
      setTimeout(() => window.audioEngine?.beep(900, 0.1, 'sine'), 100);
      setTimeout(() => window.audioEngine?.beep(1200, 0.15, 'sine'), 200);
      
      // Glitch burst before transition
      window.glitchEngine?.burst(400);
      window.audioEngine?.glitchSound();
      
      setTimeout(() => {
        this.onComplete();
      }, 500);
    });

    this.body.scrollTop = this.body.scrollHeight;
  }
}

window.BootSequence = BootSequence;
