import { getLocale, getTranslations } from "next-intl/server";
import { careerNodes } from "@/content/career";
import type { Locale } from "@/content/types";

function formatPeriod(
  start: string,
  end: string | null,
  locale: Locale,
  present: string,
) {
  const fmt = (iso: string) =>
    new Date(`${iso}-01T00:00:00`).toLocaleDateString(locale, {
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} — ${end ? fmt(end) : present}`;
}

export async function Experience() {
  const t = await getTranslations("Experience");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="experience" className="mx-auto w-full max-w-3xl px-6 py-24">
      <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
      <p className="mt-2 text-neutral-400">{t("subtitle")}</p>

      <ol className="mt-12 space-y-12 border-l border-neutral-800 pl-8">
        {careerNodes.map((node) => (
          <li key={node.id} className="relative">
            <span className="absolute -left-[37px] top-1.5 size-2.5 rounded-full bg-emerald-400" />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-xl font-semibold">{node.company}</h3>
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">
                {t(`kind_${node.kind}`)}
              </span>
            </div>
            <p className="text-neutral-300">{node.role[locale]}</p>
            <p className="font-mono text-sm text-neutral-500">
              {formatPeriod(node.start, node.end, locale, t("present"))} ·{" "}
              {node.mode[locale]}
            </p>
            <p className="mt-3 text-neutral-400">{node.summary[locale]}</p>
            {node.highlights.length > 0 && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-neutral-400">
                {node.highlights.map((h, i) => (
                  <li key={i}>{h[locale]}</li>
                ))}
              </ul>
            )}
            {node.metrics && (
              <div className="mt-4 flex flex-wrap gap-4">
                {node.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-4 py-2"
                  >
                    <span className="text-lg font-bold text-emerald-400">
                      {m.value}
                    </span>{" "}
                    <span className="text-sm text-neutral-400">
                      {m.label[locale]}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {node.tech.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {node.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-neutral-800 px-3 py-1 font-mono text-xs text-neutral-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
