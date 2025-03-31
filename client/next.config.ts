import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },
  async rewrites() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'crue.com'
          }
        ],
        destination: '/coordinator'
      },
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'worker.crue.com'
          }
        ],
        destination: '/worker'
      },
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'coordinator.crue.com'
          }
        ],
        destination: '/coordinator'
      }
    ]
  }
};

export default nextConfig;
