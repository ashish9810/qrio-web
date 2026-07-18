import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/get',
        destination: 'https://play.google.com/store/apps/details?id=com.qrio.qrio',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
