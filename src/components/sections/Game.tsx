"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useTones } from "../sfx";

const SERVICES = ["api", "db", "cache", "queue", "auth", "cdn"];
const MAX_HEALTH = 5;
const TICK_MS = 100;
const BEST_KEY = "wp-uptime-best";

interface Svc {
  id: string;
  failing: boolean;
  timeLeft: number;
  window: number;
  flash: number;
  flashKind: "fix" | "down" | null;
}

interface GameState {
  services: Svc[];
  health: number;
  elapsed: number;
  spawnIn: number;
}

function initialState(): GameState {
  return {
    services: SERVICES.map((id) => ({
      id,
      failing: false,
      timeLeft: 0,
      window: 0,
      flash: 0,
      flashKind: null,
    })),
    health: MAX_HEALTH,
    elapsed: 0,
    spawnIn: 1.2,
  };
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Game() {
  const t = useTranslations("Game");
  const game = useRef<GameState>(initialState());
  const lastTick = useRef(0);
  const [, render] = useReducer((x: number) => x + 1, 0);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [best, setBest] = useState(0);
  const [sound, setSound] = useState(true);
  // Kept in a ref so the game loop's closure always reaches the live version
  const tone = useTones(sound);
  const toneRef = useRef(tone);
  toneRef.current = tone;

  const sfx = useMemo(
    () => ({
      alert: () =>
        toneRef.current({
          notes: [
            [988, 0.06],
            [740, 0.09],
          ],
          gain: 0.04,
        }),
      fix: () =>
        toneRef.current({
          notes: [
            [660, 0.05],
            [880, 0.08],
          ],
          gain: 0.045,
        }),
      down: () =>
        toneRef.current({
          notes: [
            [220, 0.12],
            [165, 0.2],
          ],
          type: "sawtooth",
        }),
      over: () =>
        toneRef.current({
          notes: [
            [440, 0.14],
            [330, 0.14],
            [196, 0.34],
          ],
          type: "sawtooth",
        }),
    }),
    [],
  );

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(BEST_KEY));
    if (Number.isFinite(stored) && stored > 0) setBest(stored);
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    lastTick.current = performance.now();
    const interval = window.setInterval(() => {
      const g = game.current;
      // Measure real time so the clock stays honest; the cap effectively
      // pauses the game while the tab is hidden and timers are throttled
      const now = performance.now();
      const dt = Math.min(0.25, (now - lastTick.current) / 1000);
      lastTick.current = now;
      g.elapsed += dt;

      for (const s of g.services) {
        if (s.flash > 0) {
          s.flash = Math.max(0, s.flash - dt);
          if (s.flash === 0) s.flashKind = null;
        }
        if (!s.failing) continue;
        s.timeLeft -= dt;
        if (s.timeLeft <= 0) {
          s.failing = false;
          s.timeLeft = 0;
          s.flash = 0.6;
          s.flashKind = "down";
          g.health -= 1;
          sfx.down();
        }
      }

      // Failures come faster and leave less time to react as you survive
      g.spawnIn -= dt;
      if (g.spawnIn <= 0) {
        const healthy = g.services.filter((s) => !s.failing);
        if (healthy.length > 0) {
          const pick = healthy[Math.floor(Math.random() * healthy.length)];
          pick.window = clamp(3.4 - g.elapsed * 0.06, 1.3, 3.4);
          pick.timeLeft = pick.window;
          pick.failing = true;
          sfx.alert();
        }
        g.spawnIn = clamp(1.7 - g.elapsed * 0.045, 0.5, 1.7);
      }

      if (g.health <= 0) {
        g.health = 0;
        sfx.over();
        const score = Math.floor(g.elapsed);
        setBest((b) => {
          if (score > b) {
            window.localStorage.setItem(BEST_KEY, String(score));
            return score;
          }
          return b;
        });
        setPhase("over");
      }
      render();
    }, TICK_MS);
    return () => window.clearInterval(interval);
  }, [phase]);

  const start = useCallback(() => {
    game.current = initialState();
    setPhase("playing");
    render();
  }, []);

  const fix = useCallback(
    (id: string) => {
      if (phase !== "playing") return;
      const s = game.current.services.find((x) => x.id === id);
      if (!s || !s.failing) return;
      s.failing = false;
      s.timeLeft = 0;
      s.flash = 0.35;
      s.flashKind = "fix";
      sfx.fix();
      render();
    },
    [phase, sfx],
  );

  const g = game.current;
  const playing = phase === "playing";

  return (
    <section id="game" className="mx-auto w-full max-w-3xl px-6 py-24">
      <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
      <p className="mt-2 text-neutral-400">{t("subtitle")}</p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-950/85 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-xs text-neutral-500">
          <span>
            {t("uptime")}{" "}
            <span className="text-lg tabular-nums text-white">
              {formatTime(g.elapsed)}
            </span>
          </span>
          <span>
            {t("health")}{" "}
            <span className="tracking-widest text-emerald-400">
              {"|".repeat(g.health)}
              <span className="text-neutral-700">
                {"|".repeat(MAX_HEALTH - g.health)}
              </span>
            </span>
          </span>
          <span>
            {t("best")}{" "}
            <span className="tabular-nums text-neutral-300">
              {formatTime(best)}
            </span>
          </span>
          <button
            onClick={() => setSound((v) => !v)}
            className="hover:text-neutral-300"
          >
            {sound ? t("sound_on") : t("sound_off")}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {g.services.map((s) => {
            const tone = s.failing
              ? "border-amber-500/80 bg-amber-500/10 text-amber-300"
              : s.flashKind === "down"
                ? "border-red-500/80 bg-red-500/10 text-red-300"
                : s.flashKind === "fix"
                  ? "border-emerald-400/80 bg-emerald-500/10 text-emerald-300"
                  : "border-neutral-800 text-neutral-500";
            return (
              <button
                key={s.id}
                onClick={() => fix(s.id)}
                disabled={!playing || !s.failing}
                aria-label={`${s.id}: ${s.failing ? t("failing") : t("ok")}`}
                className={`relative overflow-hidden rounded-xl border px-4 py-4 text-left transition-colors ${tone} ${
                  s.failing ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className="block font-mono text-sm">{s.id}</span>
                <span className="mt-1 block font-mono text-xs tabular-nums opacity-80">
                  {s.failing
                    ? `${s.timeLeft.toFixed(1)}s`
                    : s.flashKind === "down"
                      ? t("down")
                      : t("ok")}
                </span>
                {s.failing && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-400"
                    style={{
                      width: `${(s.timeLeft / s.window) * 100}%`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {phase === "over" ? (
            <p className="font-mono text-sm">
              <span className="text-red-400">{t("outage")}</span>{" "}
              <span className="text-neutral-400">
                {t("result", { time: formatTime(g.elapsed) })}
              </span>
            </p>
          ) : (
            <p className="font-mono text-xs text-neutral-500">{t("hint")}</p>
          )}
          {!playing && (
            <button
              onClick={start}
              className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              {phase === "over" ? t("again") : t("start")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
