import { getLocale, getTranslations } from "next-intl/server";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/types";

export async function Projects() {
  const t = await getTranslations("Projects");
  const locale = (await getLocale()) as Locale;
  const github = profile.socials.find((s) => s.label === "GitHub")?.url;

  return (
    <section id="projects" className="mx-auto w-full max-w-5xl px-6 py-24">
      <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
      <p className="mt-2 text-neutral-400">{t("subtitle")}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects
          .filter((project) => project.featured)
          .map((project) => {
            const archived = project.kind === "archive";
            return (
              <article
                key={project.id}
                className={`flex flex-col rounded-xl border p-6 transition hover:border-neutral-600 ${
                  archived
                    ? "border-neutral-900 bg-neutral-950/50"
                    : "border-neutral-800 bg-neutral-950/85"
                }`}
              >
                <span
                  className={`font-mono text-xs uppercase tracking-wider ${
                    archived ? "text-neutral-500" : "text-emerald-400"
                  }`}
                >
                  {t(`kind_${project.kind}`)}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm text-neutral-400">
                  {project.description[locale]}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-neutral-800 px-2.5 py-0.5 font-mono text-xs text-neutral-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    {t("view_repo")} →
                  </a>
                )}
              </article>
            );
          })}
      </div>

      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm font-medium text-neutral-400 hover:text-white"
        >
          {t("more")} →
        </a>
      )}
    </section>
  );
}
