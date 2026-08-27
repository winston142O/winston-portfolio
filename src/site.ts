/**
 * Canonical origin for metadata, sitemap and robots.
 *
 * Falls back to the domain Railway injects, so a fresh deploy has correct
 * absolute URLs before a custom domain is configured.
 *
 * Uses truthiness rather than `??` on purpose: a Docker `ARG` that is never
 * passed still defines the variable as an empty string.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();

export const siteUrl =
  configured ||
  (railwayDomain ? `https://${railwayDomain}` : "http://localhost:3000");
