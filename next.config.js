const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

module.exports = withBundleAnalyzer(withMDX({
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
      },
      { // link to nftontrend.com
        source: '/wazirx-collaborates-with-moengage-to-drive-web3-0-and-cryptocurrency-adoption-in-india-the-financial-express',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/video-game-nfts-top-legal-considerations-for-developers-wsgr-com',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/open-call-nft-house-crafting-spaces-for-the-metaverse-archdaily',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/the-brit-awards-with-mastercard-announce-their-first-ever-nft-collection-bpi-british-phonographic-industry',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/are-nfts-the-next-impact-investing-craze-for-millennials-nasdaq',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/how-to-get-free-nfts-airdrops-mints-benzinga-benzinga',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/index.php/category/new-nft',
        destination: '/explore',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/next-big-thing-in-nfts-generative-ai-art-datadriveninvestor',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/looks-crypto-looksrare-soars-with-nft-market-launch-and-token-airdrop-nasdaq',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/3-crypto-moonshots-to-get-ahead-of-the-next-big-thing-nasdaq-5',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/nfts-in-video-games-skeptics-push-back-at-developers-conference-marketplace',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/square-enix-launches-first-nft-project-on-enjins-efinity-blockchain-nftgators',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/opensea-walks-back-on-ipo-plan-following-community-backlash-cointelegraph',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/what-is-cryptogodz-nft-game-clutchpoints',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/what-are-non-fungible-tokens-nfts-the-motley-fool-australia-the-motley-fool-australia',
        destination: '/learn/nfts/what-are-nfts',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/challenges-faced-by-nft-collections-altcoin-buzz',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/what-are-nfts-a-guide-for-investors-u-s-news-world-report-money',
        destination: '/learn/nfts/what-are-nfts',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/what-are-dynamic-nfts-and-how-do-they-differ-from-static-nfts-the-financial-express',
        destination: '/learn/nfts/what-are-nfts',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/a-night-at-the-seattle-nft-museum-slog-thestranger-com',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/web3-activists-fight-for-reproductive-rights-with-nfts-daos-and-protests-cointelegraph',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/is-fanduel-stock-worth-betting-on-investment-u',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/watch-as-flares-are-set-off-in-the-crowd-to-mark-liam-gallaghers-arrival-in-glasgow',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/top-5-best-brand-nfts-ranked-november-18-2021-adage-com-8',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/nfts-as-a-democratizing-force-for-artists-and-patrons-venturebeat',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/opensea-nft-activity-can-now-be-tracked-with-parsiq-crypto-briefing',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/why-do-celebrities-love-nfts-so-much-vulture',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/video-game-nfts-top-legal-considerations-for-developers-wsgr-com',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/university-of-miami-football-using-military-fitness-device-to-track-teams-biometric-data-sporttechie',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/accomplished-artist-visbii-launches-revolutionary-socially-conscious-nft-collection-advocating-mental-ein-news',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/is-it-possible-to-develop-an-nft-marketplace-on-harmony-blockchain-datadriveninvestor',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/adidas-originals-enters-the-metaverse-partners-with-nft-players-gadgets-360',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/rogue-station-companies-inc-everdime-technologies-inc-globenewswire',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/neonomad-to-be-launched-on-xtstarter-bitcoinist-com-bitcoinist',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/what-is-an-nft-how-non-fungible-tokens-work-business-insider',
        destination: '/learn/nfts/what-are-nfts',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/what-are-the-pros-and-cons-of-investing-in-nfts-business-review',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/international-melodic-techno-artist-the-alexsander-reveals-details-on-his-upcoming-nft-album-and-nft-music-project-robopunkz-digital-journal',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/web2-companies-are-facing-heat-for-embracing-web3-crypto-briefing',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/will-nfts-in-real-estate-be-a-thing-in-2022-the-motley-fool',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/infiniteworld-to-participate-in-icr-virtual-conference-business-wire',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/news',
        destination: '/learn',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/globalbet-virtualsports-takes-the-metaverse-lead-and-launches-its-own-first-nft-collection-globenewswire',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/web-3-0-the-new-frontier-of-gaming-bcs-bcs',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/biggest-cardano-based-cross-chain-nft-marketplace-verlux-kicks-off-pre-sale-bitcoinist-com-bitcoinist-com',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/from-pudgy-to-tubby-overweight-felines-dominate-nft-volume-the-defiant-defi-news',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/202-nft-growth-and-sports-memorabilia-demand-will-boost-the-collectibles-market-to-692-4-billion-revenue-by-2032-market-decipher-usa-english-usa-pr-newswire',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/what-a-journey-ahead-buzzwords-for-2022-wit-web-in-travel',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/upcoming-drops-july-25-31-nft-now',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/best-nft-marketplaces-that-could-fare-better-than-opensea-in-2022-coinbase-rarible-and-more-tech-times',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/why-are-social-media-companies-nuts-for-nfts-economic-times',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/top-nft-marketplace-opensea-admits-shady-employee-dealings-mashable',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/digital-renaissance-nft-platform-for-artists-launches-55000-art-contest-nftevening-com',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/universal-music-wants-to-take-frank-zappa-into-the-metaverse-bloomberg',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/msian-internet-star-smashpop-launches-his-first-nft-collection-with-new-streetwear-project-vulcan-post',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/stephanduq-nft-artist-interview-nft-culture',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/best-nft-real-estate-land-projects-in-june-2022-business-2-community',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/15-most-expensive-nfts-sold-so-far-gobankingrates',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/unfortunately-this-games-gorgeous-studio-ghibli-art-music-cant-make-up-for-bad-gameplay-vulcan-post',
        destination: '/',
        permanent: true
      },
      { // link to nftontrend.com
        source: '/bored-ape-yacht-club-nft-sales-jump-past-1-billion-markets-insider',
        destination: '/',
        permanent: true
      },
    ]
  },
  experimental: {
    scrollRestoration: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = { 
        net: false,
        tls: false,
        fs: false
      } 
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}))

