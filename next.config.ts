import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    // Resolved at build time, not hardcoded: an absolute path from one
    // developer's machine breaks every other checkout and the Vercel build.
    // This only needs setting at all because a second lockfile in the parent
    // folder makes Next guess the workspace root wrongly.
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'kujelectronics-peach.vercel.app',
          },
        ],
        destination: 'https://rajelectronics.co/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'rajelectronics-peach.vercel.app',
          },
        ],
        destination: 'https://rajelectronics.co/:path*',
        permanent: true,
      },
    ];
  },
};


export default nextConfig;
