import { getTranslations } from "next-intl/server";
import { profile } from "@/content/profile";
import { ContactForm } from "./ContactForm";

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section
      id="contact"
      className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-32 text-center"
    >
      <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
      <p className="mt-2 text-neutral-400">{t("subtitle")}</p>
      <ContactForm />
      <p className="mt-10 text-sm text-neutral-500">
        {t("or_email")}{" "}
        <a
          href={`mailto:${profile.email}`}
          className="text-neutral-300 underline-offset-4 hover:underline"
        >
          {profile.email}
        </a>
      </p>
      <p className="mt-4 text-sm text-neutral-500">{t("or_find_me")}</p>
      <div className="mt-3 flex gap-6">
        {profile.socials.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-neutral-300 underline-offset-4 hover:underline"
          >
            {social.label}
          </a>
        ))}
      </div>
    </section>
  );
}
