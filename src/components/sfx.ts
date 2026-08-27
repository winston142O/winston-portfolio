"use client";

import { useCallback, useRef } from "react";

export interface Tone {
  /** [frequency in Hz, duration in seconds] played back to back */
  notes: [number, number][];
  type?: OscillatorType;
  gain?: number;
}

/** Tiny Web Audio bleeper: no audio files, tones generated on the fly. */
export function useTones(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(
    (tone: Tone) => {
      if (!enabled) return;
      try {
        if (!ctxRef.current) {
          const AC =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext;
          if (!AC) return;
          ctxRef.current = new AC();
        }
        const ctx = ctxRef.current;
        // Browsers start the context suspended until a user gesture
        if (ctx.state === "suspended") void ctx.resume();

        let at = ctx.currentTime;
        for (const [freq, dur] of tone.notes) {
          const osc = ctx.createOscillator();
          const vol = ctx.createGain();
          osc.type = tone.type ?? "square";
          osc.frequency.setValueAtTime(freq, at);
          vol.gain.setValueAtTime(tone.gain ?? 0.05, at);
          vol.gain.exponentialRampToValueAtTime(0.0001, at + dur);
          osc.connect(vol).connect(ctx.destination);
          osc.start(at);
          osc.stop(at + dur);
          at += dur;
        }
      } catch {
        // Audio is a nice-to-have; never let it break a game
      }
    },
    [enabled],
  );
}
