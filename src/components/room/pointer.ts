// Shared pointer state in normalized device coordinates (-1..1)
export const pointerState = {
  x: -10,
  y: -10,
  seen: false,
  // Incremented on every click; consumers keep their own last-seen count
  clickCount: 0,
};

let attached = false;

export function ensurePointerTracking() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerState.seen = true;
    },
    { passive: true },
  );
  window.addEventListener(
    "pointerdown",
    (e) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerState.seen = true;
      pointerState.clickCount++;
    },
    { passive: true },
  );
}
