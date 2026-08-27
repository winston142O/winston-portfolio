# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
# Next.js and sharp expect glibc-compatible symbols on musl
RUN apk add --no-cache libc6-compat
WORKDIR /app

# --- dependencies -----------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- build ------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Baked into the build because Next inlines NEXT_PUBLIC_* and prerenders
# metadata, sitemap and robots at build time. Optional: without it the app
# falls back to Railway's injected domain at build time.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Railway exposes this to the build only if the ARG is declared
ARG RAILWAY_PUBLIC_DOMAIN
ENV RAILWAY_PUBLIC_DOMAIN=$RAILWAY_PUBLIC_DOMAIN
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --- runtime ----------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# standalone omits public/ and .next/static by design; copy them in
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Railway overrides PORT at runtime; HOSTNAME must be 0.0.0.0 inside a container
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "server.js"]
