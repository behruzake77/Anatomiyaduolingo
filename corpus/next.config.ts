import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Preview/nasos (e2b.app) — dev rejimda to'g'ri origin ruxsati.
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
