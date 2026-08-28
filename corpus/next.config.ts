import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Preview/nasos (e2b.app) — dev rejimda to'g'ri origin ruxsati.
  allowedDevOrigins: ["*.e2b.app"],
  // APK/oflayn build: statik eksport (BUILD_EXPORT=1 npm run build → out/).
  ...(process.env.BUILD_EXPORT === "1" ? { output: "export" as const } : {}),
};

export default nextConfig;
