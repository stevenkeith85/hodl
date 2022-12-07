const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/learn/connecting-a-wallet',
        destination: '/learn/dapps/interact-with-dapps',
        permanent: true
      },
      {
        source: '/learn/sign-up-with-coinbase-mobile',
        destination: '/learn/sign-in/coinbase-wallet',
        permanent: true
      }
    ]
  },
  experimental: {
    scrollRestoration: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
})

