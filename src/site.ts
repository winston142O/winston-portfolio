/**
 * Canonical origin for metadata, sitemap, robots and structured data.
 *
 * Hardcoded in production so canonical URLs can never silently point at a
 * platform subdomain, which would split SEO signals across two hosts.
 * NEXT_PUBLIC_SITE_URL still overrides it for staging or preview deploys.
 *
 * Truthiness rather than `??`: an undeclared Docker ARG still defines the
 * variable as an empty string.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl =
  configured ||
  (process.env.NODE_ENV === "production"
    ? "https://www.winstonpichardo.dev"
    : "http://localhost:3000");
