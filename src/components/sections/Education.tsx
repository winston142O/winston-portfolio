import { getLocale, getTranslations } from "next-intl/server";
import {
  education,
  certifications,
  certificatesFolderUrl,
} from "@/content/education";
import type { Locale } from "@/content/types";

function formatDate(iso: string, locale: Locale) {
  return new Date(`${iso}-01T00:00:00`).toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });
}

export async function Education() {
  const t = await getTranslations("Education");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="education" className="mx-auto w-full max-w-5xl px-6 py-24">
      <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
      <p className="mt-2 text-neutral-400">{t("subtitle")}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {education.map((entry) => (
          <article
            key={entry.id}
            className="rounded-xl border border-neutral-800 bg-neutral-950/85 p-6"
          >
            <h3 className="text-lg font-semibold">{entry.school}</h3>
            <p className="mt-1 text-neutral-300">{entry.degree[locale]}</p>
            <p className="mt-2 font-mono text-sm text-neutral-500">
              {formatDate(entry.start, locale)} — {formatDate(entry.end, locale)}
            </p>
            <p className="text-sm text-neutral-500">{entry.location[locale]}</p>
          </article>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">{t("certifications")}</h3>
        <a
          href={certificatesFolderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-neutral-700 px-5 py-2 text-sm font-medium transition hover:border-neutral-400"
        >
          {t("view_all")} →
        </a>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications
          .filter((cert) => cert.featured)
          .map((cert) => (
            <article
              key={cert.name}
              className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-950/85 p-5 transition hover:border-neutral-600"
            >
              <span className="mb-3 block h-px w-8 bg-emerald-400" />
              <h4 className="text-sm font-semibold leading-snug">
                {cert.name}
              </h4>
              <p className="mt-2 flex-1 text-sm text-neutral-400">
                {cert.issuer}
              </p>
              {cert.date && (
                <p className="mt-2 font-mono text-xs text-neutral-500">
                  {formatDate(cert.date, locale)}
                </p>
              )}
              {cert.proof && (
                <a
                  href={cert.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  {t("view_credential")} →
                </a>
              )}
            </article>
          ))}
      </div>
    </section>
  );
}
