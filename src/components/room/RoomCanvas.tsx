"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useScrollStore } from "../system/scrollStore";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const MAX_RECOVERIES = 5;

export function RoomCanvas() {
  const [enabled, setEnabled] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const recoveries = useRef(0);

  const handleContextDeath = useCallback(() => {
    if (recoveries.current >= MAX_RECOVERIES) {
      setEnabled(false);
      return;
    }
    recoveries.current += 1;
    setTimeout(() => setEpoch((e) => e + 1), 1000);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      useScrollStore.getState().setReady();
      return;
    }
    setEnabled(true);
  }, []);

  if (!enabled) return null;
  return <HeroScene key={epoch} onContextDeath={handleContextDeath} />;
}
