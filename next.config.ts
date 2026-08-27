import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Emits .next/standalone: a self-contained server with only the traced
  // dependencies, so the runtime image needs no node_modules install.
  output: "standalone",
};

export default withNextIntl(nextConfig);
