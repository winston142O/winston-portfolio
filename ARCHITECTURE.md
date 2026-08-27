# Portfolio — technical notes

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 |
| 3D | three.js via React Three Fiber (`@react-three/fiber`, `@react-three/drei`) |
| i18n | `next-intl`, locale-prefixed routes (`/en`, `/es`) |
| State | Zustand (one tiny store for scene readiness) |
| Email | Resend, called from a React Server Action |
| Audio | Web Audio API, oscillators generated at runtime (no files) |

No CSS framework beyond Tailwind, no component library, no animation library, no
3D model files. Every visual is procedural.

## Routing and i18n

- `src/proxy.ts` — Next 16 renamed `middleware.ts` to `proxy.ts`. It runs
  `next-intl`'s locale negotiation, so `/` redirects to `/en` or `/es`.
- `src/i18n/routing.ts` defines locales; `request.ts` loads the right message file.
- Pages live at `src/app/[locale]/page.tsx` and are statically prerendered for both
  locales via `generateStaticParams`.
- UI strings live in `messages/en.json` and `messages/es.json`.
- Long-form content (jobs, projects, certs) lives in `src/content/*.ts` as typed
  objects with `{ en, es }` fields, so one data structure feeds both languages,
  and the terminal's virtual filesystem reads from the same source.

**Gotcha:** editing `messages/*.json` requires a dev server restart. Turbopack
caches them, and the symptom is `MISSING_MESSAGE` for keys that visibly exist.

## The particle system

This is the whole hero. It is a single `THREE.LineSegments` object with a custom
GLSL shader, drawn in one draw call.

### Geometry

Each particle is a **line segment**, i.e. two vertices. For N particles the buffers
hold 2N vertices with these attributes:

- `position` — the particle's home point in the drifting field. Both vertices of a
  segment share it.
- `aSeed` — one random value per particle (shared by its two vertices) used to
  de-synchronise motion and stagger the logo assembly.
- `aEnd` — `0` for the first vertex, `1` for the second. This is how the shader
  knows which end of the streak it is drawing.
- `aTarget` — where this particle goes when it forms the logo.

Count is 3200 on desktop, 1800 on small screens or coarse pointers.

### What the vertex shader does, in order

1. **Drift.** A cheap sum of sines of the particle's own position plus time gives an
   offset `off` and a velocity `vel`. No physics, no simulation state, so nothing
   has to be stored between frames. The whole field is a pure function of
   `(position, aSeed, uTime)`.
2. **Logo morph.** `m = smoothstep(clamp(uMorph * 1.35 - aSeed * 0.35))`. Because
   `aSeed` is subtracted, every particle crosses the threshold at a slightly
   different time, so the logo assembles organically instead of snapping. Then
   `p = mix(p, aTarget, m)`.
3. **Cursor swirl.** `mm = exp(-dot(md, md) / 3.0)` is a Gaussian falloff around the
   mouse. The push direction is `cross(md, up)`, normalised, which produces rotation
   around the cursor rather than a straight shove. It is applied *after* the morph,
   which is why you can smear the logo apart and watch it pull itself back.
4. **Click shockwave.** `uPulse` carries `(origin.xyz, startTime)`. The shader
   computes an expanding ring `exp(-(distance - t*5)²/1.2) * exp(-t*1.2)` and pushes
   particles outward along it. It expires on its own after 3 seconds, so no cleanup.
5. **Streak.** The final position is `p + dir * (aEnd - 0.5) * len`, where `dir` is
   the normalised velocity. The two vertices land on opposite sides of the particle
   along its direction of travel, so the segment *is* a motion streak. `len` shrinks
   as `m` rises, so particles tighten into crisp dots when they form the logo.

`glow` accumulates through all of that and is passed to the fragment shader, which
just lerps between grey and emerald and sets alpha. Additive blending plus
`depthWrite: false` makes dense areas bloom without any post-processing pass.

### How the logo is generated

`makeTargets()` in `HeroMist.tsx`:

1. Draw `WP` into an offscreen 2D canvas with `fillText`.
2. Read the pixels back with `getImageData` and collect the coordinates of every
   pixel whose alpha > 128 (sampling every 2px).
3. Ask the camera how much world space is actually visible at the logo's depth:
   `visibleHeight = 2 * distance * tan(fov/2)`, `visibleWidth = visibleHeight * aspect`.
   Fit the logo to 80% of that (90% on narrow screens), capped at `LOGO_MAX_WIDTH`.
4. Map each pixel onto a **camera-facing plane** by walking along the camera's own
   right and up vectors (`camera.matrixWorld` columns 0 and 1), so the logo always
   faces the viewer.
5. Pick a random glyph pixel per particle and write it into `aTarget`.

Rebuilt on resize and orientation change, which is what keeps it fitting on phones.

### Scroll behaviour

`uMorph` is driven by `1 - smoothstep(scrollY / innerHeight, 0.25, 0.7)`, so the logo
holds while you are in the hero and dissolves back into the wind as you scroll away.
The canvas is `position: fixed` behind everything (`z-0`, `pointer-events: none`),
so the mist continues behind every section instead of stopping at the hero.

## Robustness decisions worth knowing

- **No post-processing.** An earlier version used `@react-three/postprocessing` for
  bloom. In dev, React StrictMode mounts the canvas twice, R3F force-loses the first
  WebGL context, and `EffectComposer` then crashed on the dead context
  (`Cannot read properties of null (reading 'alpha')`), taking the whole canvas down
  on every load. Glow is done with additive blending instead. **Do not add bloom back.**
- **Context-loss recovery.** `RoomCanvas.tsx` listens for `webglcontextlost`. If the
  browser does not restore within 1.5s it bumps an `epoch` key on the scene, which
  remounts the `<Canvas>` with a fresh context. Capped at 5 recoveries.
- **Shader NaN safety.** Never `normalize()` a vector that can be zero-length. All
  normalisations divide by `length(v) + 1e-4`. A single NaN vertex can corrupt an
  entire frame on some GPUs.
- **`dpr={[1, 1.25]}` and `powerPreference: "low-power"`** to keep the GPU calm.
- **Reduced motion.** `prefers-reduced-motion` skips the 3D entirely; every section is
  plain DOM and reads fine without it.

## Loader

`Loader.tsx` shows a boot sequence with a progress bar that creeps asymptotically to
90% and only hits 100% when the scene reports ready. Readiness comes from
`ReadyReporter` inside the R3F scene, which counts three rendered frames and flips a
flag in the Zustand store — so the loader waits for actual pixels, not for a
download to finish. A 6s hard timeout releases it regardless, and reduced-motion
users skip it instantly.

## Games

**Uptime Defense** (`sections/Game.tsx`) — six services fail on a ramping schedule;
click one before its timer expires. Game state lives in a `useRef` and rendering is
driven by a `useReducer` bump, which keeps the loop out of React's state scheduling.
The clock uses real `performance.now()` deltas clamped to 0.25s, so browser tab
throttling can't desync it, and the clamp effectively pauses the game when hidden.
Best score in `localStorage`.

**Pac-Man** (`sections/Pacman.tsx`) — hand-written: a 19×11 maze as an array of
strings, pellets mutated in place, two ghosts that chase by Manhattan distance with
a no-reverse rule and 20% randomness, frightened mode on power pellets, three lives.
Rendered as text with run-length grouping so each row is a handful of coloured
`<span>`s. Keyboard, swipe, and an always-visible D-pad.

> The bug that broke this once: the board was built inside a `useMemo` whose
> dependency never changed, so it rendered frame 1 and froze while the game ran fine
> underneath. The board is now derived on every render. Don't memoize it.

**Audio** (`components/sfx.ts`) — a `useTones` hook creates one `AudioContext` lazily
and plays sequences of `[frequency, duration]` pairs through an oscillator plus a
gain envelope. Both games declare their own note tables. Chrome caps AudioContexts
per document, which is worth remembering if audio ever goes silent while testing.

## Terminal

`sections/Terminal.tsx` is a real shell over a virtual filesystem built from
`src/content/*`, so `cat experience/xploy.txt` prints live data in the current
locale. Implements `ls, cd, cat, pwd, tree, neofetch, uptime, ps, open, help, man,
history, echo, date, clear` plus joke handlers for `sudo`, `rm`, `vim`, `exit`, and
`pacman` to launch the game. Tab completion, arrow-key history, Ctrl+C, Ctrl+L.
`uptime` and `ps` compute from the career data, so they stay true as jobs change.

## Contact form

`app/actions/contact.ts` is a Server Action, so no API route and no client secret.
Validates, checks a honeypot field, and sends via Resend with `replyTo` set to the
sender. Without `RESEND_API_KEY` it returns a friendly error and the page falls back
to a plain mailto link. Env vars documented in `.env.example`.

## SEO

Per-locale `generateMetadata` with canonical URLs and `hreflang` alternates, a
generated OG image (`opengraph-image.tsx` using `next/og`), plus `sitemap.ts` and
`robots.ts`. All keyed off `NEXT_PUBLIC_SITE_URL`.

## CV pipeline

`cv-source/` holds `winston-pichardo-cv-{en,es}.html` sharing `cv.css`. PDFs are
generated with headless Chrome:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for l in en es; do
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="public/cv/winston-pichardo-cv-$l.pdf" \
    "file://$PWD/cv-source/winston-pichardo-cv-$l.html"
done
```

`--no-pdf-header-footer` removes Chrome's date/URL/page-number header. Margins must
live on `@page`, not on container padding, or every page after the first loses its
top margin. The hero button and the terminal's `open cv.pdf` both link to the
locale-matching file.

## Running it

```bash
npm run dev -- --port 3799     # dev
npm run build && npm start     # production
npx tsc --noEmit               # typecheck
```

**Never run `npm run build` while `next dev` is running** — they share `.next` and
the dev server will start serving a corrupted mix of old and new chunks.
