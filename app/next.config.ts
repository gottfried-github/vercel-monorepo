import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: true,
  // https://nextjs.org/docs/app/guides/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      {
        source: '/',
        destination: '/boards',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
