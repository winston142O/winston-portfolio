"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { pointerState, ensurePointerTracking } from "./pointer";

function particleCount() {
  if (typeof window === "undefined") return 3200;
  const smallScreen = window.innerWidth < 768;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return smallScreen || coarsePointer ? 1800 : 3200;
}

const vertexShader = /* glsl */ `
uniform float uTime;
uniform vec3 uMouse;
uniform vec4 uPulse; // xyz: origin, w: start time
uniform float uMorph; // 0..1 how strongly particles form the logo
attribute float aSeed;
attribute float aEnd;
attribute vec3 aTarget;
varying float vGlow;
varying float vAlpha;

void main() {
  vec3 base = position;
  float t = uTime * 0.5;
  float s = aSeed * 6.2831;

  vec3 off = vec3(
    sin(base.y * 0.6 + t * 1.1 + s) * 0.9,
    sin(base.x * 0.35 + t * 0.7 + s * 0.5) * 0.4,
    cos(base.y * 0.55 + t * 0.9 + s) * 0.7
  );
  vec3 vel = vec3(
    cos(base.y * 0.6 + t * 1.1 + s) * 1.1,
    cos(base.x * 0.35 + t * 0.7 + s * 0.5) * 0.35,
    -sin(base.y * 0.55 + t * 0.9 + s) * 0.8
  );
  vec3 p = base + off;
  float glow = 0.0;

  // Logo formation, staggered per particle so it assembles organically
  float m = clamp(uMorph * 1.35 - aSeed * 0.35, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  p = mix(p, aTarget, m);
  glow += m * 0.85;

  // Mouse swirl applies AFTER formation, so the logo scatters under the cursor
  vec3 md = p - uMouse;
  float mm = exp(-dot(md, md) / 3.0);
  vec3 swirl = cross(md, vec3(0.0, 1.0, 0.0));
  swirl /= (length(swirl) + 1e-4);
  p += swirl * mm * (0.9 + m * 1.4);
  vel += swirl * mm * 4.0;
  glow += mm * 1.5;

  float pt = uTime - uPulse.w;
  if (pt > 0.0 && pt < 3.0) {
    float radius = pt * 5.0;
    float dp = distance(p, uPulse.xyz);
    float ring = exp(-pow(dp - radius, 2.0) / 1.2) * exp(-pt * 1.2);
    vec3 outward = (p - uPulse.xyz) / (dp + 1e-3);
    p += outward * ring * (0.5 + m * 1.0);
    vel += outward * ring * 3.0;
    glow += ring * 1.4;
  }

  vec3 dir = vel / (length(vel) + 1e-4);
  float len = (0.2 + mm * 0.35 + glow * 0.1) * (1.0 - m * 0.8) + 0.045 * m;
  vec3 finalPos = p + dir * (aEnd - 0.5) * len;

  vGlow = clamp(glow, 0.0, 1.0);
  vAlpha = 0.22 + 0.5 * vGlow;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying float vGlow;
varying float vAlpha;

void main() {
  vec3 dim = vec3(0.4);
  vec3 accent = vec3(0.063, 0.725, 0.506);
  gl_FragColor = vec4(mix(dim, accent, vGlow), vAlpha);
}
`;

const LOGO_CENTER = new THREE.Vector3(0.4, 1.4, 0);
// On narrow screens the hero text sits on top, so the logo drops into the space below it
const LOGO_CENTER_NARROW = new THREE.Vector3(0, 0.2, 0);
// Two glyphs at the same per-letter size the four-glyph "W.P." had at 8.2
const LOGO_MAX_WIDTH = 4.1;

const FONT_PX = 190;
const LINE_PX = FONT_PX * 1.02;
const PAD_PX = 10;
const FONT = `bold ${FONT_PX}px 'Courier New', monospace`;

/** Sample the logo's pixels into world-space particle targets on a camera-facing plane. */
function makeTargets(
  camera: THREE.Camera,
  targetAttr: THREE.BufferAttribute,
  count: number,
) {
  // What the camera can actually see at the logo's depth
  const persp = camera as THREE.PerspectiveCamera;
  const dist = camera.position.distanceTo(new THREE.Vector3(0, 1.6, 0));
  const visibleHeight = 2 * dist * Math.tan((persp.fov * Math.PI) / 360);
  const visibleWidth = visibleHeight * persp.aspect;

  const narrow = visibleWidth < 7;
  const lines = ["WP"];
  const center = narrow ? LOGO_CENTER_NARROW : LOGO_CENTER;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = FONT;
  const textW = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const textH = lines.length * LINE_PX;

  canvas.width = Math.ceil(textW) + PAD_PX * 2;
  canvas.height = Math.ceil(textH) + PAD_PX * 2;
  // Resizing the canvas resets the context, so restate the drawing settings
  ctx.font = FONT;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, PAD_PX + LINE_PX * (i + 0.5));
  });

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pts: number[] = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) {
        pts.push(x, y);
      }
    }
  }
  if (pts.length === 0) return;

  // Narrow screens are width-limited, so use nearly all of it
  const maxW = narrow
    ? visibleWidth * 0.9
    : Math.min(LOGO_MAX_WIDTH, visibleWidth * 0.8);
  const maxH = visibleHeight * 0.6;
  const scale = Math.min(maxW / textW, maxH / textH);

  const e = camera.matrixWorld.elements;
  const right = new THREE.Vector3(e[0], e[1], e[2]).normalize();
  const up = new THREE.Vector3(e[4], e[5], e[6]).normalize();
  const world = new THREE.Vector3();
  const nPts = pts.length / 2;
  const arr = targetAttr.array as Float32Array;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  for (let i = 0; i < count; i++) {
    const pick = (Math.random() * nPts) | 0;
    const px = pts[pick * 2] - cx;
    const py = cy - pts[pick * 2 + 1];
    world
      .copy(center)
      .addScaledVector(right, px * scale)
      .addScaledVector(up, py * scale);
    for (let v = 0; v < 2; v++) {
      const j = (i * 2 + v) * 3;
      arr[j] = world.x + (Math.random() - 0.5) * 0.025;
      arr[j + 1] = world.y + (Math.random() - 0.5) * 0.025;
      arr[j + 2] = world.z + (Math.random() - 0.5) * 0.025;
    }
  }
  targetAttr.needsUpdate = true;
}

export function HeroMist() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouseWorld = useRef(new THREE.Vector3(999, 999, 999));
  const unprojected = useRef(new THREE.Vector3());
  const pointerSeen = useRef(false);
  const lastClick = useRef(pointerState.clickCount);
  const targetsBuilt = useRef(false);
  const count = useMemo(() => particleCount(), []);

  useEffect(() => {
    ensurePointerTracking();
    // Re-fit the logo whenever the viewport changes (resize, orientation change)
    const onResize = () => {
      targetsBuilt.current = false;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const { geometry, uniforms, targetAttr } = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);
    const targets = new Float32Array(count * 2 * 3);
    const seeds = new Float32Array(count * 2);
    const ends = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 26;
      const y = -0.5 + Math.random() * 7;
      const z = (Math.random() - 0.5) * 14;
      const seed = Math.random();
      for (let v = 0; v < 2; v++) {
        const j = i * 2 + v;
        positions[j * 3] = x;
        positions[j * 3 + 1] = y;
        positions[j * 3 + 2] = z;
        seeds[j] = seed;
        ends[j] = v;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const targetAttr = new THREE.BufferAttribute(targets, 3);
    geometry.setAttribute("aTarget", targetAttr);
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aEnd", new THREE.BufferAttribute(ends, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 999) },
      uPulse: { value: new THREE.Vector4(0, 0, 0, -10) },
      uMorph: { value: 0 },
    };
    return { geometry, uniforms, targetAttr };
  }, [count]);

  useFrame(({ clock, camera }) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value = clock.elapsedTime;

    if (!targetsBuilt.current) {
      targetsBuilt.current = true;
      makeTargets(camera, targetAttr, count);
    }

    // The logo holds in the hero, then dissolves into the wind as you scroll
    const scrollFrac = window.scrollY / window.innerHeight;
    const strength = 1 - THREE.MathUtils.smoothstep(scrollFrac, 0.25, 0.7);
    u.uMorph.value += (strength - u.uMorph.value) * 0.05;

    unprojected.current
      .set(pointerState.x, pointerState.y, 0.5)
      .unproject(camera);
    unprojected.current.sub(camera.position).normalize();
    mouseWorld.current
      .copy(camera.position)
      .addScaledVector(unprojected.current, 7);

    const uMouse = u.uMouse.value as THREE.Vector3;
    if (pointerState.seen && !pointerSeen.current) {
      pointerSeen.current = true;
      uMouse.copy(mouseWorld.current);
    } else if (pointerSeen.current) {
      uMouse.lerp(mouseWorld.current, 0.15);
    }

    if (pointerState.clickCount !== lastClick.current) {
      lastClick.current = pointerState.clickCount;
      const pulse = u.uPulse.value as THREE.Vector4;
      pulse.set(
        mouseWorld.current.x,
        mouseWorld.current.y,
        mouseWorld.current.z,
        clock.elapsedTime,
      );
    }
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
