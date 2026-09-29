/** @type {import('next').NextConfig} */
const nextConfig = {
  // Files read with fs at request time must be traced into the serverless
  // bundle; the per-post OG image route reads these (see src/lib/og.tsx).
  outputFileTracingIncludes: {
    '/**/insights/**': ['./src/app/fonts/*.woff', './public/logos/ba-logo-trans-white.png'],
    '/insights/**': ['./src/app/fonts/*.woff', './public/logos/ba-logo-trans-white.png'],
  },
  // Allow connections from Windows host
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  },
  // For WSL2 development
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  }
}

module.exports = nextConfig