import type { NextConfig } from "next";

const isPreproduction = process.env.NEXT_PUBLIC_SITE_ENV === "preproduction";

/** Baseline security headers for every page. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Pre-production must never be indexed, whatever a crawler finds.
  ...(isPreproduction ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // "About" became "Experience"; keep old links working.
  async redirects() {
    return [{ source: "/about", destination: "/experience", permanent: true }];
  },
};

export default nextConfig;
