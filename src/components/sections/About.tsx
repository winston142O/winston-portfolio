import Image from "next/image";
import { getTranslations } from "next-intl/server";
import portrait from "../../../public/images/winston.jpeg";

export async function About() {
  const t = await getTranslations("About");

  return (
    <section id="about" className="mx-auto w-full max-w-3xl px-6 py-24">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <Image
          src={portrait}
          alt="Winston Pichardo"
          width={192}
          height={192}
          className="size-48 shrink-0 rounded-2xl object-cover ring-1 ring-emerald-500/40"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-neutral-400">{t("p1")}</p>
          <p className="mt-3 text-neutral-400">{t("p2")}</p>
          <p className="mt-3 text-neutral-400">{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}
