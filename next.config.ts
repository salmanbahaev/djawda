import type { NextConfig } from "next";
import { resolveKeystaticStorage } from "./lib/env";

const storage = resolveKeystaticStorage();

const nextConfig: NextConfig = {
  transpilePackages: ["remotion", "@remotion/player"],
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
