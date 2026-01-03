// Web Audio API sound effects - no external dependencies needed

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Sparkle/chime sound effect
export const playSparkleSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create multiple oscillators for a rich sparkle sound
    const frequencies = [1200, 1800, 2400, 3000];
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.1);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08 - i * 0.015, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.05);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(now + i * 0.02);
      oscillator.stop(now + 0.5);
    });
  } catch (e) {
    console.log('Audio not available');
  }
};

// Door creak sound effect
export const playDoorCreakSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Low rumble base
    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumble.type = 'sawtooth';
    rumble.frequency.setValueAtTime(40, now);
    rumble.frequency.linearRampToValueAtTime(80, now + 1.5);
    rumbleGain.gain.setValueAtTime(0, now);
    rumbleGain.gain.linearRampToValueAtTime(0.05, now + 0.3);
    rumbleGain.gain.linearRampToValueAtTime(0.02, now + 1.2);
    rumbleGain.gain.linearRampToValueAtTime(0, now + 1.8);
    rumble.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    rumble.start(now);
    rumble.stop(now + 2);
    
    // Creaky high frequencies
    for (let i = 0; i < 6; i++) {
      const creak = ctx.createOscillator();
      const creakGain = ctx.createGain();
      const creakFilter = ctx.createBiquadFilter();
      
      creak.type = 'square';
      const baseFreq = 200 + Math.random() * 300;
      creak.frequency.setValueAtTime(baseFreq, now + i * 0.25);
      creak.frequency.linearRampToValueAtTime(baseFreq + 100 + Math.random() * 150, now + i * 0.25 + 0.15);
      
      creakFilter.type = 'bandpass';
      creakFilter.frequency.setValueAtTime(400 + i * 100, now);
      creakFilter.Q.setValueAtTime(5, now);
      
      creakGain.gain.setValueAtTime(0, now + i * 0.25);
      creakGain.gain.linearRampToValueAtTime(0.02 + Math.random() * 0.01, now + i * 0.25 + 0.05);
      creakGain.gain.linearRampToValueAtTime(0, now + i * 0.25 + 0.2);
      
      creak.connect(creakFilter);
      creakFilter.connect(creakGain);
      creakGain.connect(ctx.destination);
      
      creak.start(now + i * 0.25);
      creak.stop(now + i * 0.25 + 0.3);
    }
    
    // Whoosh effect
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5;
    }
    noise.buffer = noiseBuffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(100, now);
    noiseFilter.frequency.linearRampToValueAtTime(800, now + 0.8);
    noiseFilter.frequency.linearRampToValueAtTime(200, now + 1.5);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.5);
    noiseGain.gain.linearRampToValueAtTime(0, now + 1.5);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + 1.5);
  } catch (e) {
    console.log('Audio not available');
  }
};
