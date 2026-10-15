import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn2.thecatapi.com" },
      { protocol: "https", hostname: "cdn.thecatapi.com" },
      { protocol: "https", hostname: "images.dog.ceo" },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      // Public, same-for-everyone data: cache on the CDN for 5 minutes.
      // Later rules override the "no-store" rule above for these exact paths.
      // Chat, feed, session, AI and login are user-specific and stay no-store.
      ...["/api/guides", "/api/news", "/api/vehicles", "/api/music/stations", "/api/fun/weather"].map(
        (source) => ({
          source,
          headers: [
            { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=900" },
          ],
        }),
      ),
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
        ],
      },
    ];
  },
};

export default nextConfig;
