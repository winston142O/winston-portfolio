"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useScrollStore } from "./system/scrollStore";

const HARD_TIMEOUT_MS = 6000;

export function Loader() {
  const t = useTranslations("Loader");
  const ready = useScrollStore((s) => s.ready);
  const [timedOut, setTimedOut] = useState(false);
  const [gone, setGone] = useState(false);
  const [progress, setProgress] = useState(0);

  const done = ready || timedOut;

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), HARD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  // Creep toward 90% while the scene loads; never pretend to finish early
  useEffect(() => {
    if (done) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 2800;
      const value = Math.min(90, 90 * (1 - Math.exp(-2.2 * elapsed)));
      setProgress(value);
      if (value < 90) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  useEffect(() => {
    if (!done) return;
    setProgress(100);
    const timer = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(timer);
  }, [done]);

  if (gone) return null;

  const step = done ? 3 : progress < 30 ? 0 : progress < 60 ? 1 : 2;
  const steps = [t("step1"), t("step2"), t("step3"), t("online")];

  return (
    <div
      id="scene-loader"
      role="status"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity delay-300 duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <noscript>
        <style>{`#scene-loader{display:none}`}</style>
      </noscript>
      <span className="font-mono text-3xl font-bold tracking-tight text-white">
        w<span className="animate-pulse text-emerald-400">.</span>p
        <span className="animate-pulse text-emerald-400">.</span>
      </span>
      <div className="mt-10 w-64">
        <div className="flex items-baseline justify-between font-mono text-xs">
          <span className={done ? "text-emerald-400" : "text-neutral-500"}>
            {steps[step]}
          </span>
          <span className="tabular-nums text-neutral-500">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-900">
          <div
            className="h-full rounded-full bg-emerald-400 transition-[width] duration-300 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 12px rgba(52, 211, 153, 0.8)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
