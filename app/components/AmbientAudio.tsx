"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const animRef = useRef(0);

  const stopAudio = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
    nodesRef.current = [];
    cancelAnimationFrame(animRef.current);
    setPlaying(false);
  }, []);

  const startAudio = useCallback(async () => {
    setLoading(true);
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.15;
      masterGain.connect(ctx.destination);

      const nodes: AudioNode[] = [masterGain];

      // --- Rain noise ---
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 2000;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.4;

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start();
      nodes.push(noise, noiseFilter, noiseGain);

      // --- Low drone ---
      const droneOsc = ctx.createOscillator();
      droneOsc.type = "sine";
      droneOsc.frequency.value = 55; // Low A

      const droneOsc2 = ctx.createOscillator();
      droneOsc2.type = "sine";
      droneOsc2.frequency.value = 55.5; // Slight detune for movement

      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.08;

      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = "lowpass";
      droneFilter.frequency.value = 200;

      droneOsc.connect(droneFilter);
      droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc.start();
      droneOsc2.start();
      nodes.push(droneOsc, droneOsc2, droneGain, droneFilter);

      // --- Sub bass pulse ---
      const subOsc = ctx.createOscillator();
      subOsc.type = "sine";
      subOsc.frequency.value = 30;

      const subGain = ctx.createGain();
      subGain.gain.value = 0.03;

      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();
      nodes.push(subOsc, subGain);

      // Pulse the sub bass slowly
      let pulseTime = 0;
      const pulse = () => {
        pulseTime += 0.01;
        subGain.gain.value = 0.02 + 0.02 * Math.sin(pulseTime * 0.5);
        // Modulate drone filter
        droneFilter.frequency.value = 150 + 50 * Math.sin(pulseTime * 0.3);
        animRef.current = requestAnimationFrame(pulse);
      };
      pulse();

      nodesRef.current = nodes;
      setPlaying(true);
    } catch {
      // Ignore errors (autoplay policy, etc)
    }
    setLoading(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      stopAudio();
    } else {
      startAudio();
    }
  }, [playing, startAudio, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="fixed bottom-4 right-4 z-50 font-mono text-[9px] 
        border border-[var(--neon-cyan)]/30 rounded px-2 py-1.5
        text-[var(--neon-cyan)]/60 hover:text-[var(--neon-cyan)]
        hover:border-[var(--neon-cyan)]/60
        bg-black/50 backdrop-blur
        transition-all duration-300
        hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]"
      aria-label={playing ? "Detener ambiente" : "Activar ambiente sonoro"}
      title={playing ? "Detener ambiente Blade Runner" : "Activar ambiente Blade Runner"}
    >
      {loading ? (
        <span className="animate-pulse">[ SYNCING ... ]</span>
      ) : playing ? (
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
          [ AMBIENT ON ]
        </span>
      ) : (
        <span>[ ▶ PLAY AMBIENT ]</span>
      )}
    </button>
  );
}
