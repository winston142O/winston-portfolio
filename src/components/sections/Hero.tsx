import { getLocale, getTranslations } from "next-intl/server";
import { profile } from "@/content/profile";

export async function Hero() {
  const t = await getTranslations("Hero");
  const locale = await getLocale();

  return (
    <section className="relative h-svh w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-24 text-center sm:items-start sm:pl-12 sm:text-left lg:pl-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">
          {t("role")}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mt-3 max-w-md text-lg font-medium text-neutral-200">
          {t("tagline")}
        </p>
        <div className="pointer-events-auto mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="#contact"
            className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            {t("cta_contact")}
          </a>
          <a
            href={`/cv/winston-pichardo-cv-${locale}.pdf`}
            className="rounded-full border border-neutral-700 bg-black/40 px-5 py-2.5 text-sm font-semibold transition hover:border-neutral-400"
          >
            {t("cta_cv")}
          </a>
        </div>
      </div>
    </section>
  );
}
