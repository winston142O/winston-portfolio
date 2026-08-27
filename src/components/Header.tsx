import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export async function Header() {
  const t = await getTranslations("Nav");
  const locale = await getLocale();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm">
      <a href="#" className="font-mono text-sm font-bold tracking-tight">
        w<span className="text-emerald-400">.</span>p
        <span className="text-emerald-400">.</span>
      </a>
      <nav className="flex items-center gap-6 text-sm">
        <a href="#about" className="hidden text-neutral-400 hover:text-white md:block">
          {t("about")}
        </a>
        <a href="#experience" className="hidden text-neutral-400 hover:text-white md:block">
          {t("experience")}
        </a>
        <a href="#projects" className="hidden text-neutral-400 hover:text-white md:block">
          {t("projects")}
        </a>
        <a href="#education" className="hidden text-neutral-400 hover:text-white md:block">
          {t("education")}
        </a>
        <a href="#contact" className="hidden text-neutral-400 hover:text-white md:block">
          {t("contact")}
        </a>
        <a
          href="#game"
          className="hidden text-emerald-400 hover:text-emerald-300 md:block"
        >
          {t("fun")}
        </a>
        <div className="flex gap-1 rounded-full border border-neutral-800 p-1 font-mono text-xs">
          {routing.locales.map((l) => (
            <Link
              key={l}
              href="/"
              locale={l}
              className={`rounded-full px-2.5 py-1 uppercase transition ${
                l === locale
                  ? "bg-neutral-200 text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {l}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
