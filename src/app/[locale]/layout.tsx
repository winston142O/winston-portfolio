import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const descriptions: Record<string, string> = {
  en: "Full-stack software engineer with 8 years building SaaS platforms, payment integrations, and cloud applications. Open to freelance projects, and consulting.",
  es: "Ingeniero de software full-stack con 8 años construyendo plataformas SaaS, integraciones de pago y aplicaciones en la nube. Abierto a proyectos freelance y consultoría.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = descriptions[locale] ?? descriptions.en;
  return {
    metadataBase: new URL(siteUrl),
    title: "Winston Pichardo · Software Engineer",
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      title: "Winston Pichardo · Software Engineer",
      description,
      siteName: "Winston Pichardo",
      locale: locale === "es" ? "es_DO" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Winston Pichardo · Software Engineer",
      description,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
