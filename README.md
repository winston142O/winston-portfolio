# Winston Pichardo — Portfolio

> Software people depend on.

My personal site: a bilingual portfolio built around a GPU particle field that
assembles itself into my initials, with a working shell and a couple of games
hidden at the bottom for anyone who scrolls that far.

**Live:** [winstonpichardo.dev](https://winstonpichardo.dev/)

---

## What's interesting in here

**A particle system that costs almost nothing.** The hero is a single
`THREE.LineSegments` object drawn in one call. Each particle is a two-vertex
segment whose ends are offset along its own velocity, which is what makes them
read as motion streaks instead of dots. There is no physics loop and no state
between frames: position and velocity are a pure function of `(position, seed, time)`,
so the GPU rebuilds the entire field every frame and the CPU does nothing.

**The logo is sampled, not modeled.** The `WP` mark is drawn into an offscreen 2D
canvas, read back with `getImageData`, and every opaque pixel becomes a target
position. Those targets are projected onto a camera-facing plane sized from the
camera's actual frustum, so the mark always faces the viewer and refits itself on
phones and on resize. Each particle crosses its formation threshold at a slightly
different moment, so the letters gather rather than snap.

**It reacts.** Cursor movement swirls particles around the pointer (the push
direction comes from a cross product, not a straight shove, so it rotates), clicks
send an expanding shockwave through the field, and scrolling dissolves the logo back
into the wind. Glow comes from additive blending rather than a post-processing pass,
which keeps it to one draw call and avoids a whole class of WebGL context problems.

**A shell that isn't faked.** The terminal at the bottom runs over a virtual
filesystem generated from the same typed content that renders the rest of the site,
so `cat experience/xploy.txt` prints real data in whichever language you're browsing.
It has tab completion, command history, `ls`/`cd`/`cat`/`tree`/`neofetch`/`ps`, and
a Pac-Man implementation written from scratch. `uptime` and `ps` are computed from
my career data, so they stay true as jobs change.

**Everything is procedural.** No 3D models, no audio files, no component library,
no animation library. The game sounds are oscillators built at runtime.

## Stack

Next.js 16 (App Router, React 19) · TypeScript · Tailwind CSS v4 ·
three.js / React Three Fiber · next-intl · Zustand · Resend

## Running it

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). `/` redirects to `/en`;
Spanish lives at `/es`.

```bash
npm run build && npm start   # production
npx tsc --noEmit             # typecheck
```

Copy `.env.example` to `.env.local` for the contact form and canonical URLs. Without
a Resend key the form degrades gracefully to a mailto link, so the site runs fine
without any configuration.

## Layout

```
src/
├── app/[locale]/      routes, metadata, OG image
├── app/actions/       contact form server action
├── components/
│   ├── room/          the particle scene (shader, canvas, pointer state)
│   └── sections/      hero, about, experience, projects, education,
│                      contact, game, terminal, pacman
├── content/           typed bilingual content (career, projects, education)
└── i18n/              locale routing
messages/              UI strings, en + es
cv-source/             CV as HTML, printed to PDF with headless Chrome
```


## Accessibility and fallbacks

The 3D layer is decorative and entirely optional. `prefers-reduced-motion` skips it,
every section is plain semantic DOM underneath, and the scene rebuilds itself if the
browser drops its WebGL context.

---

Built by [Winston Pichardo](https://linkedin.com/in/winston-pichardo).
