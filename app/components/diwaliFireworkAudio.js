// # Synthesize short rocket whistles and soft firework booms locally. There are
// # no audio downloads. Create this controller inside a click handler so browsers
// # can unlock audio; the visual celebration never waits for audio permission.
export function createFireworkAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.22;
  master.connect(context.destination);

  // # Reuse one noise buffer for every burst instead of allocating on each boom.
  const noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const samples = noise.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.random() * 2 - 1;
  }

  return {
    resume: () => context.resume(),
    setMuted(muted) {
      master.gain.setTargetAtTime(muted ? 0 : 0.22, context.currentTime, 0.02);
    },
    playLaunch() {
      if (context.state !== "running") return;

      const now = context.currentTime;
      const whistle = context.createOscillator();
      const envelope = context.createGain();
      whistle.type = "sine";
      whistle.frequency.setValueAtTime(500, now);
      whistle.frequency.exponentialRampToValueAtTime(1500, now + 0.7);
      envelope.gain.setValueAtTime(0.001, now);
      envelope.gain.exponentialRampToValueAtTime(0.08, now + 0.12);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      whistle.connect(envelope).connect(master);
      whistle.start(now);
      whistle.stop(now + 0.9);
      whistle.onended = () => {
        whistle.disconnect();
        envelope.disconnect();
      };
    },
    playBurst() {
      if (context.state !== "running") return;

      const now = context.currentTime;
      const crackle = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const envelope = context.createGain();
      crackle.buffer = noise;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2300, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.75);
      envelope.gain.setValueAtTime(0.001, now);
      envelope.gain.exponentialRampToValueAtTime(0.65, now + 0.015);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      crackle.connect(filter).connect(envelope).connect(master);
      crackle.start(now);
      crackle.stop(now + 0.9);
      crackle.onended = () => {
        crackle.disconnect();
        filter.disconnect();
        envelope.disconnect();
      };
    },
    close() {
      if (context.state !== "closed") void context.close().catch(() => {});
    },
  };
}
