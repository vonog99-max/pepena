class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(500, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playSlash() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.0, now);
    filter.frequency.setValueAtTime(3500, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    subGain.gain.setValueAtTime(0.15, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.18);
    subOsc.start(now);
    subOsc.stop(now + 0.15);
  }

  playFire() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const duration = 0.35;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    const fireOsc = this.ctx.createOscillator();
    const fireGain = this.ctx.createGain();
    fireOsc.type = 'triangle';
    fireOsc.frequency.setValueAtTime(320, now);
    fireOsc.frequency.linearRampToValueAtTime(90, now + duration);

    fireGain.gain.setValueAtTime(0.12, now);
    fireGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    fireOsc.connect(fireGain);
    fireGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
    fireOsc.start(now);
    fireOsc.stop(now + duration);
  }

  playHit() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const duration = 0.15;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    const hitOsc = this.ctx.createOscillator();
    const hitGain = this.ctx.createGain();
    hitOsc.type = 'sawtooth';
    hitOsc.frequency.setValueAtTime(100, now);
    hitOsc.frequency.linearRampToValueAtTime(45, now + duration);

    hitGain.gain.setValueAtTime(0.22, now);
    hitGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    hitOsc.connect(hitGain);
    hitGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
    hitOsc.start(now);
    hitOsc.stop(now + duration);
  }

  playCrit() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    
    this.playHit();

    const ringFreqs = [523.25, 659.25, 783.99, 1046.50];
    ringFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.2 + idx * 0.02);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, now);

      gain.gain.setValueAtTime(0.04, now + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22 + idx * 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.02);
      osc.stop(now + 0.25 + idx * 0.02);
    });
  }

  playSummon() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;

    const baseKeys = [261.63, 311.13, 392.00, 466.16, 523.25, 622.25];
    baseKeys.forEach((freq, idx) => {
      const delay = idx * 0.09;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.4 + delay);

      gain.gain.setValueAtTime(0.0, now + delay);
      gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.6);
    });
  }

  playVictory() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;

    const melody = [
      { f: 523.25, d: 0.15, offset: 0.0 },
      { f: 659.25, d: 0.15, offset: 0.15 },
      { f: 783.99, d: 0.15, offset: 0.30 },
      { f: 1046.50, d: 0.45, offset: 0.45 },
    ];

    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const subOsc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.offset);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(note.f / 2, now + note.offset);

      gain.gain.setValueAtTime(0.0, now + note.offset);
      gain.gain.linearRampToValueAtTime(0.1, now + note.offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.offset + note.d);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + note.offset);
      subOsc.start(now + note.offset);
      
      osc.stop(now + note.offset + note.d + 0.05);
      subOsc.stop(now + note.offset + note.d + 0.05);
    });
  }

  playDefeat() {
    this.init();
    this.resume();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;

    const melody = [
      { f: 311.13, d: 0.25, offset: 0.0 },
      { f: 293.66, d: 0.25, offset: 0.25 },
      { f: 261.63, d: 0.25, offset: 0.50 },
      { f: 196.00, d: 0.60, offset: 0.75 },
    ];

    melody.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, now + note.offset);
      osc.frequency.linearRampToValueAtTime(note.f - 10, now + note.offset + note.d);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.0, now + note.offset);
      gain.gain.linearRampToValueAtTime(0.08, now + note.offset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.offset + note.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + note.offset);
      osc.stop(now + note.offset + note.d + 0.05);
    });
  }
}

export const audio = new AudioEngine();
