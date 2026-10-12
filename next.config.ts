import type { NextConfig } from "next";
import { resolveKeystaticStorage } from "./lib/env";

const storage = resolveKeystaticStorage();

const nextConfig: NextConfig = {
  // Keystatic sends the GitHub App flow to 127.0.0.1, not localhost.
  allowedDevOrigins: ["127.0.0.1"],
  env: {
    NEXT_PUBLIC_KEYSTATIC_STORAGE: storage,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  outputFileTracingIncludes: {
    "/api/**": ["./content/**/*"],
  },
};

export default nextConfig;
