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
