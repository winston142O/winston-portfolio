"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { careerNodes } from "@/content/career";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { certifications, education } from "@/content/education";
import type { CareerNode, Locale, Project } from "@/content/types";
import { Pacman } from "./Pacman";

type Node = string | Dir;
interface Dir {
  [name: string]: Node;
}

interface Line {
  kind: "in" | "out" | "err";
  text: string;
}

const USER = "winston";
const HOST = "portfolio";
const CAREER_START = "2018-02";

const COMMANDS = [
  "help",
  "whoami",
  "ls",
  "cd",
  "cat",
  "pwd",
  "tree",
  "neofetch",
  "uptime",
  "ps",
  "open",
  "github",
  "linkedin",
  "mail",
  "history",
  "date",
  "echo",
  "clear",
  "man",
  "pacman",
  "sudo",
  "exit",
];

function fmtMonth(iso: string, locale: Locale) {
  return new Date(`${iso}-01T00:00:00`).toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });
}

function jobFile(node: CareerNode, locale: Locale, present: string) {
  const period = `${fmtMonth(node.start, locale)} - ${
    node.end ? fmtMonth(node.end, locale) : present
  }`;
  return [
    `${node.company} :: ${node.role[locale]}`,
    `${period} · ${node.mode[locale]}`,
    "",
    node.summary[locale],
    "",
    ...node.highlights.map((h) => `  - ${h[locale]}`),
    ...(node.metrics ?? []).map((m) => `  * ${m.value} ${m.label[locale]}`),
    "",
    `tech: ${node.tech.join(", ")}`,
  ].join("\n");
}

function projectFile(p: Project, locale: Locale) {
  return [
    p.name,
    "",
    p.description[locale],
    "",
    `tech: ${p.tech.join(", ")}`,
    ...(p.repo ? [`repo: ${p.repo}`] : []),
  ].join("\n");
}

function uptimeString(locale: Locale) {
  const start = new Date(`${CAREER_START}-01T00:00:00`);
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  months %= 12;
  return locale === "es"
    ? `${years} años, ${months} meses`
    : `${years} years, ${months} months`;
}

function resolve(cwd: string[], arg: string): string[] {
  const absolute = arg.startsWith("/") || arg.startsWith("~");
  const parts = absolute ? [] : [...cwd];
  for (const seg of arg.replace(/^~\/?|^\//, "").split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return parts;
}

function lookup(root: Dir, parts: string[]): Node | null {
  let cur: Node = root;
  for (const p of parts) {
    if (typeof cur === "string") return null;
    const next: Node | undefined = cur[p];
    if (next === undefined) return null;
    cur = next;
  }
  return cur;
}

function treeLines(dir: Dir, prefix = ""): string[] {
  const names = Object.keys(dir);
  return names.flatMap((name, i) => {
    const last = i === names.length - 1;
    const node = dir[name];
    const branch = last ? "`-- " : "|-- ";
    const isDir = typeof node !== "string";
    const line = `${prefix}${branch}${name}${isDir ? "/" : ""}`;
    if (!isDir) return [line];
    return [line, ...treeLines(node, prefix + (last ? "    " : "|   "))];
  });
}

export function Terminal() {
  const t = useTranslations("Terminal");
  const locale = useLocale() as Locale;
  const tExp = useTranslations("Experience");

  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [cwd, setCwd] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const history = useRef<string[]>([]);
  const histIndex = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fs = useMemo<Dir>(() => {
    const present = tExp("present");
    return {
      "about.txt": [
        `${profile.name} — ${locale === "es" ? "Ingeniero de Software" : "Software Engineer"}`,
        profile.location[locale],
        "",
        t("about"),
      ].join("\n"),
      "skills.txt": [
        "backend    node.js, express, nestjs, python, django, flask, celery, .net, c#",
        "frontend   react, react native, vue, typescript, javascript, tailwind",
        "data       postgresql, mysql, sql server, mongodb, redis, rabbitmq",
        "cloud      aws (s3, ec2, iam), docker, kubernetes, railway, ci/cd, terraform",
        "other      stripe, websockets, llm tooling, k-means, load testing",
      ].join("\n"),
      "contact.txt": [
        `email     ${profile.email}`,
        `phone     ${profile.phone}`,
        ...profile.socials.map(
          (s) => `${s.label.toLowerCase().padEnd(10)}${s.url}`,
        ),
      ].join("\n"),
      "certs.txt": [
        ...education.map(
          (e) =>
            `${e.school} — ${e.degree[locale]} (${fmtMonth(e.start, locale)} - ${fmtMonth(e.end, locale)})`,
        ),
        "",
        ...certifications.map(
          (c) => `${c.name.padEnd(52)} ${c.issuer}`,
        ),
      ].join("\n"),
      "cv.pdf": t("binary"),
      experience: Object.fromEntries(
        careerNodes.map((n) => [`${n.id}.txt`, jobFile(n, locale, present)]),
      ),
      projects: Object.fromEntries(
        projects.map((p) => [`${p.id}.txt`, projectFile(p, locale)]),
      ),
    };
  }, [locale, t, tExp]);

  useEffect(() => {
    setLines([
      { kind: "out", text: t("banner") },
      { kind: "out", text: t("banner_hint") },
    ]);
  }, [t]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const prompt = `${USER}@${HOST}:~${cwd.length ? "/" + cwd.join("/") : ""}$`;

  const run = useCallback(
    (raw: string): Line[] => {
      const input = raw.trim();
      if (!input) return [];
      const [cmd, ...args] = input.split(/\s+/);
      const arg = args.join(" ");
      const out = (text: string): Line[] => [{ kind: "out", text }];
      const err = (text: string): Line[] => [{ kind: "err", text }];

      switch (cmd) {
        case "help":
          return out(
            [
              t("help_intro"),
              "",
              ...COMMANDS.map((c) => `  ${c.padEnd(10)} ${t(`cmd_${c}`)}`),
              "",
              t("help_keys"),
            ].join("\n"),
          );

        case "whoami":
          return out(t("whoami"));

        case "pwd":
          return out(`/home/${USER}${cwd.length ? "/" + cwd.join("/") : ""}`);

        case "ls": {
          const target = lookup(fs, arg ? resolve(cwd, arg) : cwd);
          if (target === null) return err(t("no_such", { path: arg }));
          if (typeof target === "string") return out(arg);
          const names = Object.keys(target).map((n) =>
            typeof target[n] === "string" ? n : `${n}/`,
          );
          return out(names.join("   "));
        }

        case "cd": {
          if (!arg || arg === "~" || arg === "/") {
            setCwd([]);
            return [];
          }
          const parts = resolve(cwd, arg);
          const target = lookup(fs, parts);
          if (target === null) return err(t("no_such", { path: arg }));
          if (typeof target === "string") return err(t("not_dir", { path: arg }));
          setCwd(parts);
          return [];
        }

        case "cat": {
          if (!arg) return err(t("usage_cat"));
          const target = lookup(fs, resolve(cwd, arg));
          if (target === null) return err(t("no_such", { path: arg }));
          if (typeof target !== "string") return err(t("is_dir", { path: arg }));
          return out(target);
        }

        case "tree": {
          const target = lookup(fs, arg ? resolve(cwd, arg) : cwd);
          if (target === null || typeof target === "string")
            return err(t("no_such", { path: arg }));
          return out([".", ...treeLines(target)].join("\n"));
        }

        case "neofetch":
          return out(
            [
              "  __      __ ___      " + `  ${USER}@${HOST}`,
              "  \\ \\ /\\ / // _ \\     " + "  ---------------------",
              "   \\ V  V /|  __/     " + `  OS      portfolio-linux`,
              "    \\_/\\_/  \\___|     " + `  Shell   wpsh 1.0.0`,
              "                      " + `  Uptime  ${uptimeString(locale)}`,
              "  W . P .             " + `  Stack   django · node · react`,
              "                      " + `  Editor  vscode`,
              "                      " + `  Locale  ${locale}`,
            ].join("\n"),
          );

        case "uptime":
          return out(t("uptime_out", { time: uptimeString(locale) }));

        case "ps": {
          const active = careerNodes.filter((n) => n.end === null);
          return out(
            [
              "  PID  STAT  COMMAND",
              ...active.map(
                (n, i) =>
                  `  ${String(1000 + i * 7).padEnd(5)}R     ${n.company.toLowerCase().replace(/\s+/g, "-")}`,
              ),
              `  ${String(2048).padEnd(5)}R     intec-degree`,
            ].join("\n"),
          );
        }

        case "open": {
          const target = arg.replace(/^\.\//, "");
          if (target === "cv.pdf" || target === "cv") {
            window.open(`/cv/winston-pichardo-cv-${locale}.pdf`, "_blank");
            return out(t("opening", { what: "cv.pdf" }));
          }
          const social = profile.socials.find(
            (s) => s.label.toLowerCase() === target.toLowerCase(),
          );
          if (social) {
            window.open(social.url, "_blank", "noopener");
            return out(t("opening", { what: social.label }));
          }
          return err(t("cannot_open", { path: arg }));
        }

        case "github":
        case "linkedin": {
          const social = profile.socials.find(
            (s) => s.label.toLowerCase() === cmd,
          );
          if (social) window.open(social.url, "_blank", "noopener");
          return out(t("opening", { what: cmd }));
        }

        case "mail":
          window.location.href = `mailto:${profile.email}`;
          return out(t("opening", { what: profile.email }));

        case "history":
          return out(
            history.current
              .map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`)
              .join("\n"),
          );

        case "date":
          return out(new Date().toString());

        case "echo":
          return out(arg);

        case "man":
          if (!arg) return err(t("usage_man"));
          if (!COMMANDS.includes(arg)) return err(t("no_manual", { cmd: arg }));
          return out(`${arg} — ${t(`cmd_${arg}`)}`);

        case "pacman":
        case "play":
          setPlaying(true);
          return [];

        case "sudo":
          return err(t("sudo"));

        case "rm":
          return err(t("rm"));

        case "vim":
        case "vi":
        case "nano":
          return out(t("editor"));

        case "exit":
        case "logout":
          return out(t("exit"));

        case "clear":
          setLines([]);
          return [];

        default:
          return err(t("not_found", { cmd }));
      }
    },
    [cwd, fs, locale, t],
  );

  const submit = useCallback(() => {
    const raw = value;
    setValue("");
    histIndex.current = -1;
    if (raw.trim()) history.current = [...history.current, raw.trim()];
    const result = run(raw);
    if (raw.trim() === "clear") return;
    setLines((prev) => [
      ...prev,
      { kind: "in", text: `${prompt} ${raw}` },
      ...result,
    ]);
  }, [value, run, prompt]);

  const complete = useCallback(() => {
    const parts = value.split(/\s+/);
    const last = parts[parts.length - 1] ?? "";
    const pool =
      parts.length <= 1
        ? COMMANDS
        : (() => {
            const dir = lookup(fs, cwd);
            return dir === null || typeof dir === "string"
              ? []
              : Object.keys(dir);
          })();
    const hits = pool.filter((c) => c.startsWith(last));
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      setValue(parts.join(" "));
    } else if (hits.length > 1) {
      setLines((prev) => [
        ...prev,
        { kind: "in", text: `${prompt} ${value}` },
        { kind: "out", text: hits.join("   ") },
      ]);
    }
  }, [value, fs, cwd, prompt]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = history.current;
      if (h.length === 0) return;
      histIndex.current =
        histIndex.current === -1
          ? h.length - 1
          : Math.max(0, histIndex.current - 1);
      setValue(h[histIndex.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (histIndex.current === -1) return;
      histIndex.current = histIndex.current + 1;
      if (histIndex.current >= h.length) {
        histIndex.current = -1;
        setValue("");
      } else {
        setValue(h[histIndex.current]);
      }
    } else if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      setLines((prev) => [...prev, { kind: "in", text: `${prompt} ${value}^C` }]);
      setValue("");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section id="terminal" className="mx-auto w-full max-w-3xl px-6 pb-32">
      <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
      <p className="mt-2 text-neutral-400">{t("subtitle")}</p>

      <div
        className="mt-8 overflow-hidden rounded-xl border border-neutral-800 bg-black/80"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/80 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-neutral-700" />
          <span className="size-2.5 rounded-full bg-emerald-600" />
          <span className="ml-2 font-mono text-xs text-neutral-500">
            {USER}@{HOST}
          </span>
        </div>

        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
        >
          {playing ? (
            <Pacman
              onExit={(score) => {
                setPlaying(false);
                setLines((prev) => [
                  ...prev,
                  { kind: "in", text: `${prompt} pacman` },
                  { kind: "out", text: t("game_result", { score }) },
                ]);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
          ) : (
            <>
              {lines.map((line, i) => (
            <pre
              key={i}
              className={`whitespace-pre-wrap break-words ${
                line.kind === "err"
                  ? "text-red-400"
                  : line.kind === "in"
                    ? "text-neutral-500"
                    : "text-neutral-300"
              }`}
            >
              {line.text}
            </pre>
          ))}
          <div className="flex items-baseline gap-2">
            <span className="shrink-0 text-emerald-400">{prompt}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label={t("input_label")}
              className="min-w-0 flex-1 bg-transparent text-neutral-100 caret-emerald-400 outline-none"
            />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
