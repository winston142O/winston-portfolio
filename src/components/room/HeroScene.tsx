"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollStore } from "../system/scrollStore";
import { pointerState } from "./pointer";
import { HeroMist } from "./HeroMist";

function ReadyReporter() {
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current > 3) return;
    frames.current += 1;
    if (frames.current === 3) {
      useScrollStore.getState().setReady();
    }
  });
  return null;
}

function CameraRig() {
  const desired = useRef(new THREE.Vector3(0, 2.5, 8.4));
  const look = useRef(new THREE.Vector3(0, 1.6, 0));
  const smoothedLook = useRef(new THREE.Vector3(0, 1.6, 0));

  useFrame(({ camera }, delta) => {
    desired.current.set(0, 2.5, 8.4);
    look.current.set(0, 1.6, 0);
    if (pointerState.seen) {
      desired.current.x += pointerState.x * 0.4;
      desired.current.y += pointerState.y * 0.25;
    }
    const k = 1 - Math.exp(-4 * delta);
    camera.position.lerp(desired.current, k);
    smoothedLook.current.lerp(look.current, k);
    camera.lookAt(smoothedLook.current);
  });

  return null;
}

export default function HeroScene({
  onContextDeath,
}: {
  onContextDeath?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      <Canvas
        camera={{ fov: 45, position: [0, 2.5, 8.4] }}
        dpr={[1, 1.25]}
        gl={{ stencil: false, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          const el = gl.domElement;
          let deathTimer: ReturnType<typeof setTimeout> | null = null;
          el.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            deathTimer = setTimeout(() => onContextDeath?.(), 1500);
          });
          el.addEventListener("webglcontextrestored", () => {
            if (deathTimer) clearTimeout(deathTimer);
          });
        }}
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 10, 26]} />

        <ReadyReporter />
        <CameraRig />
        <HeroMist />
      </Canvas>
    </div>
  );
}
