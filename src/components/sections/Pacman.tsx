"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useTones } from "../sfx";

interface Pt {
  x: number;
  y: number;
}

const STEP_MS = 110;
const FRIGHT_TICKS = 55;

type Sfx = "pellet" | "power" | "ghost" | "death" | "win";

const MAZE = [
  "###################",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o...............o#",
  "#.##.#.#####.#.##.#",
  "#....#...#...#....#",
  "####.###.#.###.####",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o...............o#",
  "###################",
];

const PAC_START: Pt = { x: 9, y: 9 };
const GHOST_STARTS: Pt[] = [
  { x: 1, y: 1 },
  { x: 17, y: 1 },
];

interface Ghost {
  pos: Pt;
  dir: Pt;
}

interface State {
  grid: string[][];
  pac: Pt;
  dir: Pt;
  next: Pt;
  ghosts: Ghost[];
  pellets: number;
  score: number;
  lives: number;
  fright: number;
  tick: number;
  over: boolean;
  won: boolean;
}

const eq = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;
const moving = (d: Pt) => d.x !== 0 || d.y !== 0;

function newState(): State {
  const grid = MAZE.map((row) => row.split(""));
  let pellets = grid.flat().filter((c) => c === "." || c === "o").length;
  // Pac starts on a pellet; consume it up front so the count stays honest
  if (grid[PAC_START.y][PAC_START.x] !== " ") {
    grid[PAC_START.y][PAC_START.x] = " ";
    pellets--;
  }
  return {
    grid,
    pac: { ...PAC_START },
    dir: { x: 0, y: 0 },
    next: { x: 0, y: 0 },
    ghosts: GHOST_STARTS.map((p) => ({ pos: { ...p }, dir: { x: 0, y: -1 } })),
    pellets,
    score: 0,
    lives: 3,
    fright: 0,
    tick: 0,
    over: false,
    won: false,
  };
}

const walkable = (grid: string[][], p: Pt) =>
  p.y >= 0 &&
  p.y < grid.length &&
  p.x >= 0 &&
  p.x < grid[0].length &&
  grid[p.y][p.x] !== "#";

const DIRS: Pt[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function moveGhost(g: Ghost, grid: string[][], target: Pt, flee: boolean) {
  const forward = DIRS.filter(
    (d) =>
      !(d.x === -g.dir.x && d.y === -g.dir.y) &&
      walkable(grid, { x: g.pos.x + d.x, y: g.pos.y + d.y }),
  );
  const pool = forward.length
    ? forward
    : DIRS.filter((d) => walkable(grid, { x: g.pos.x + d.x, y: g.pos.y + d.y }));
  if (!pool.length) return;

  let choice: Pt;
  if (Math.random() < 0.2) {
    choice = pool[Math.floor(Math.random() * pool.length)];
  } else {
    const cost = (d: Pt) =>
      Math.abs(g.pos.x + d.x - target.x) + Math.abs(g.pos.y + d.y - target.y);
    choice = pool.reduce((best, d) => {
      const better = flee ? cost(d) > cost(best) : cost(d) < cost(best);
      return better ? d : best;
    }, pool[0]);
  }
  g.dir = choice;
  g.pos = { x: g.pos.x + choice.x, y: g.pos.y + choice.y };
}

function resolveCollisions(s: State, sfx: Sfx[]) {
  s.ghosts.forEach((g, i) => {
    if (s.over || !eq(g.pos, s.pac)) return;
    if (s.fright > 0) {
      s.score += 200;
      sfx.push("ghost");
      g.pos = { ...GHOST_STARTS[i] };
      g.dir = { x: 0, y: -1 };
    } else {
      sfx.push("death");
      s.lives--;
      s.pac = { ...PAC_START };
      s.dir = { x: 0, y: 0 };
      s.next = { x: 0, y: 0 };
      s.fright = 0;
      s.ghosts.forEach((gg, j) => {
        gg.pos = { ...GHOST_STARTS[j] };
        gg.dir = { x: 0, y: -1 };
      });
      if (s.lives <= 0) s.over = true;
    }
  });
}

function step(s: State): Sfx[] {
  const sfx: Sfx[] = [];
  if (s.over || s.won) return sfx;
  s.tick++;

  // Take the queued turn as soon as it becomes legal
  if (
    moving(s.next) &&
    walkable(s.grid, { x: s.pac.x + s.next.x, y: s.pac.y + s.next.y })
  ) {
    s.dir = s.next;
  }

  if (moving(s.dir)) {
    const ahead = { x: s.pac.x + s.dir.x, y: s.pac.y + s.dir.y };
    if (walkable(s.grid, ahead)) {
      s.pac = ahead;
      const cell = s.grid[ahead.y][ahead.x];
      if (cell === "." || cell === "o") {
        s.grid[ahead.y][ahead.x] = " ";
        s.pellets--;
        s.score += cell === "o" ? 50 : 10;
        sfx.push(cell === "o" ? "power" : "pellet");
        if (cell === "o") s.fright = FRIGHT_TICKS;
        if (s.pellets === 0) {
          s.won = true;
          sfx.push("win");
          return sfx;
        }
      }
    }
  }

  resolveCollisions(s, sfx);
  if (s.over) return sfx;

  if (s.fright > 0) s.fright--;
  // Ghosts keep up at two thirds of your pace, and crawl while frightened
  const ghostTurn = s.fright > 0 ? s.tick % 2 === 0 : s.tick % 3 !== 0;
  if (ghostTurn) {
    for (const g of s.ghosts) moveGhost(g, s.grid, s.pac, s.fright > 0);
    resolveCollisions(s, sfx);
  }
  return sfx;
}

function useSfx(enabled: boolean) {
  const tone = useTones(enabled);
  const wakaHigh = useRef(false);

  return useCallback(
    (kind: Sfx) => {
      switch (kind) {
        case "pellet":
          wakaHigh.current = !wakaHigh.current;
          tone({
            notes: [[wakaHigh.current ? 520 : 380, 0.045]],
            gain: 0.035,
          });
          break;
        case "power":
          tone({
            notes: [
              [240, 0.08],
              [360, 0.1],
            ],
          });
          break;
        case "ghost":
          tone({
            notes: [
              [523, 0.06],
              [659, 0.06],
              [880, 0.12],
            ],
          });
          break;
        case "death":
          tone({
            notes: [
              [440, 0.12],
              [330, 0.12],
              [196, 0.25],
            ],
            type: "sawtooth",
          });
          break;
        case "win":
          tone({
            notes: [
              [523, 0.1],
              [659, 0.1],
              [784, 0.1],
              [1047, 0.25],
            ],
          });
          break;
      }
    },
    [tone],
  );
}

function classOf(ch: string, fright: boolean) {
  switch (ch) {
    case "#":
      return "text-neutral-700";
    case ".":
      return "text-neutral-600";
    case "o":
      return "text-amber-300";
    case "C":
      return "text-emerald-300";
    case "M":
      return fright ? "text-sky-300" : "text-red-400";
    default:
      return "text-neutral-500";
  }
}

function Row({ text, fright }: { text: string; fright: boolean }) {
  const runs: { text: string; cls: string }[] = [];
  for (const ch of text) {
    const cls = classOf(ch, fright);
    const last = runs[runs.length - 1];
    if (last && last.cls === cls) last.text += ch;
    else runs.push({ text: ch, cls });
  }
  return (
    <div className="whitespace-pre">
      {runs.map((r, i) => (
        <span key={i} className={r.cls}>
          {r.text}
        </span>
      ))}
    </div>
  );
}

export function Pacman({ onExit }: { onExit: (score: number) => void }) {
  const t = useTranslations("Terminal");
  const game = useRef<State>(newState());
  const [, setFrame] = useState(0);
  const [sound, setSound] = useState(true);
  const touchStart = useRef<Pt | null>(null);
  const playSfx = useSfx(sound);

  const steer = useCallback((x: number, y: number) => {
    game.current.next = { x, y };
    setFrame((f) => f + 1);
  }, []);

  const quit = useCallback(() => onExit(game.current.score), [onExit]);

  const sfxRef = useRef(playSfx);
  sfxRef.current = playSfx;

  useEffect(() => {
    const interval = window.setInterval(() => {
      const events = step(game.current);
      for (const e of events) sfxRef.current(e);
      setFrame((f) => f + 1);
    }, STEP_MS);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const keys: Record<string, [number, number]> = {
      arrowup: [0, -1],
      w: [0, -1],
      arrowdown: [0, 1],
      s: [0, 1],
      arrowleft: [-1, 0],
      a: [-1, 0],
      arrowright: [1, 0],
      d: [1, 0],
    };
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keys[key]) {
        e.preventDefault();
        steer(keys[key][0], keys[key][1]);
      } else if (key === "q" || key === "escape") {
        e.preventDefault();
        quit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steer, quit]);

  // Derived on every render: the board can never go stale
  const s = game.current;
  const cells = s.grid.map((row) => [...row]);
  s.ghosts.forEach((g) => {
    cells[g.pos.y][g.pos.x] = "M";
  });
  cells[s.pac.y][s.pac.x] = "C";
  const rows = cells.map((row) => row.join(""));
  const finished = s.over || s.won;

  return (
    <div
      className="flex h-full flex-col"
      onTouchStart={(e) => {
        const touch = e.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        if (!start) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
        if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 1 : -1, 0);
        else steer(0, dy > 0 ? 1 : -1);
      }}
    >
      <div className="mb-1 flex flex-wrap items-baseline gap-x-4 text-[11px] text-neutral-500">
        <span>
          {t("game_score")}{" "}
          <span className="tabular-nums text-neutral-200">{s.score}</span>
        </span>
        <span>
          {t("game_lives")}{" "}
          <span className="text-emerald-400">
            {"C".repeat(Math.max(0, s.lives))}
          </span>
        </span>
        {s.fright > 0 && <span className="text-sky-300">{t("game_fright")}</span>}
        <button
          onClick={() => setSound((v) => !v)}
          className="hover:text-neutral-300"
        >
          {sound ? t("game_sound_on") : t("game_sound_off")}
        </button>
        <span className="ml-auto">{t("game_keys")}</span>
      </div>

      <div className="text-[12px] leading-[1.2] sm:text-[13px] sm:leading-tight">
        {rows.map((row, i) => (
          <Row key={i} text={row} fright={s.fright > 0} />
        ))}
      </div>

      {finished && (
        <p className="mt-2 text-[12px] text-amber-300">
          {s.won ? t("game_win") : t("game_over")}{" "}
          <button
            onClick={quit}
            className="underline underline-offset-2 hover:text-amber-200"
          >
            {t("game_back")}
          </button>
        </p>
      )}

      {!finished && (
        <div className="mt-3 grid w-32 grid-cols-3 gap-1 self-center text-neutral-300">
          <span />
          <button
            aria-label="up"
            onClick={() => steer(0, -1)}
            className="rounded border border-neutral-700 py-2"
          >
            ^
          </button>
          <span />
          <button
            aria-label="left"
            onClick={() => steer(-1, 0)}
            className="rounded border border-neutral-700 py-2"
          >
            {"<"}
          </button>
          <button
            aria-label="quit"
            onClick={quit}
            className="rounded border border-neutral-700 py-2 text-red-400"
          >
            x
          </button>
          <button
            aria-label="right"
            onClick={() => steer(1, 0)}
            className="rounded border border-neutral-700 py-2"
          >
            {">"}
          </button>
          <span />
          <button
            aria-label="down"
            onClick={() => steer(0, 1)}
            className="rounded border border-neutral-700 py-2"
          >
            v
          </button>
          <span />
        </div>
      )}
    </div>
  );
}
