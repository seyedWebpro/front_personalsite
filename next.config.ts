import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function apiRemotePatterns() {
  const patterns: Array<{
    protocol: "http" | "https";
    hostname: string;
    port?: string;
    pathname: "/**";
  }> = [];

  const seen = new Set<string>();
  const add = (raw: string | undefined | null) => {
    if (!raw?.trim()) return;
    try {
      const url = new URL(raw.trim());
      const key = `${url.protocol}//${url.hostname}:${url.port || ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      patterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/**",
      });
    } catch {
      /* ignore invalid */
    }
  };

  add(process.env.NEXT_PUBLIC_API_BASE_URL);
  add("http://127.0.0.1:5095");
  add("http://localhost:5095");

  return patterns;
}

const remotePatterns = apiRemotePatterns();

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const api = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5095"
    ).replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${api}/api/:path*`,
      },
    ];
  },
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [70, 75, 80, 90, 95],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" ||
      /127\.0\.0\.1|localhost/i.test(
        process.env.NEXT_PUBLIC_API_BASE_URL || "",
      ),
    ...(remotePatterns.length ? { remotePatterns } : {}),
  },
};

export default withNextIntl(nextConfig);
