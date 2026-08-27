import { careerNodes } from "@/content/career";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { siteUrl } from "@/site";
import type { Locale } from "@/content/types";

/**
 * Person schema. This is the strongest signal available for a name query:
 * it tells search engines the page is *about* a person, and `sameAs` ties it
 * to the LinkedIn and GitHub profiles that already rank for that name.
 */
export function StructuredData({ locale }: { locale: Locale }) {
  const current = careerNodes.filter(
    (node) => node.end === null && node.kind === "job",
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    givenName: "Winston",
    familyName: "Pichardo",
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/${locale}/opengraph-image`,
    jobTitle: locale === "es" ? "Ingeniero de Software" : "Software Engineer",
    description:
      locale === "es"
        ? "Ingeniero de software full-stack con 8 años construyendo plataformas SaaS, sistemas de pago y aplicaciones en la nube."
        : "Full-stack software engineer with 8 years building SaaS platforms, payment systems and cloud applications.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santo Domingo",
      addressCountry: "DO",
    },
    nationality: { "@type": "Country", name: "Dominican Republic" },
    alumniOf: education.map((entry) => ({
      "@type": "EducationalOrganization",
      name: entry.school,
    })),
    worksFor: current.map((node) => ({
      "@type": "Organization",
      name: node.company,
    })),
    knowsAbout: [
      "Software Engineering",
      "Backend Development",
      "Python",
      "Django",
      "Node.js",
      "TypeScript",
      "React",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
    knowsLanguage: ["Spanish", "English"],
    sameAs: profile.socials.map((social) => social.url),
  };

  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps a stray "</script>" in the data from closing the tag
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
