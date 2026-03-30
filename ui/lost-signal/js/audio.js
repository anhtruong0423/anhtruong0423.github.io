/* ========================================
   LOST SIGNAL — Audio Engine (Web Audio API)
   ======================================== */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  // Generate a beep tone
  beep(frequency = 800, duration = 0.1, type = 'sine') {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Static noise burst
  staticNoise(duration = 0.3) {
    if (!this.initialized) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }

  // Glitch sound (rapid random beeps)
  glitchSound() {
    if (!this.initialized) return;
    const count = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.beep(200 + Math.random() * 2000, 0.03 + Math.random() * 0.05, 'square');
      }, i * 40);
    }
  }

  // Success chime
  successChime() {
    if (!this.initialized) return;
    const notes = [523, 659, 784, 1047]; // C E G C
    notes.forEach((freq, i) => {
      setTimeout(() => this.beep(freq, 0.15, 'sine'), i * 120);
    });
  }

  // Scanner ping
  scannerPing() {
    if (!this.initialized) return;
    this.beep(1200, 0.08, 'sine');
    setTimeout(() => this.beep(1800, 0.05, 'sine'), 80);
  }

  // Warning alarm
  warningAlarm() {
    if (!this.initialized) return;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.beep(440, 0.12, 'sawtooth'), i * 250);
    }
  }

  // Frequency tone (for decode phase)
  playFrequencyTone(frequency, duration = 0.5) {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
    return osc;
  }

  // Low hum (ambient)
  startHum() {
    if (!this.initialized) return;
    this.humOsc = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();
    this.humOsc.type = 'sine';
    this.humOsc.frequency.value = 60;
    this.humGain.gain.value = 0.03;
    this.humOsc.connect(this.humGain);
    this.humGain.connect(this.masterGain);
    this.humOsc.start();
  }

  stopHum() {
    if (this.humOsc) {
      this.humOsc.stop();
      this.humOsc = null;
    }
  }

  // Revelation sweep
  revelationSweep() {
    if (!this.initialized) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 2);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 3);
  }
}

window.audioEngine = new AudioEngine();
