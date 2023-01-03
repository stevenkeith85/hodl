import { HodlBorderedBox } from "../../components/HodlBorderedBox";
import { HodlShareButton } from "../../components/HodlShareButton";
import Head from "next/head";
import Box from "@mui/material/Box";
import Link from "next/link";
import { getTokenVMs } from "../../lib/database/rest/Tokens";
import { NftWindow } from "../../components/NftWindow";


export async function getStaticProps(context) {

  let ids = [];

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    ids = [
      909, 907, 905, 903, 901, 899, 897, 895, 893, 891, 889, 887, 885, 883, 881, 879, 876, 875, 873, 871,
      869, 867, 865, 863, 861, 859, 858, 855, 850, 849, 842, 840, 837, 834, 832, 830, 828, 825, 823, 820,
      816, 813, 812, 809, 806, 804, 801, 799, 797, 794, 793, 790, 788, 787, 785, 784, 782, 780, 771, 769,
      749, 747, 746, 743, 740, 736, 734, 731, 726, 724, 722, 720, 717, 715, 711, 710, 708, 703, 701, 697,
      691, 688, 685, 684, 672, 606, 604, 603, 913, 914, 916, 918, 920, 921, 928, 939, 941, 947, 944, 943
    ];
  } else {
    ids = [
      1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 1, 2, 3, 4, 5,
      6, 7, 8, 8, 10, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 1, 2, 3, 4, 5, 6, 7, 8, 8,
      10, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 1, 2, 3,
      4, 5, 6, 7, 8, 8, 10, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 1, 2, 3, 4, 5, 6, 7, 8,
      8, 10,
    ];
  }

  const tokens = await getTokenVMs(ids);
  return {
    props: {
      tokens
    },
  }
}

const MainLinks = ({ top = true }) => (
  <div
    style={{
      margin: top ? '0 0 32px 0' : '32px 0 0 0',
      display: 'flex',
      gap: '16px'
    }}>
    <HodlShareButton />
  </div>
)


export default function NewYear2023({ tokens }) {

  const title = "The New Year in NFTs - 2023";
  const metaDescription = "See how the Hodl My Moon community celebrated the new year";
  const canonical = "https://www.hodlmymoon.com/blog/new-year-2023-in-nfts";
  const socialImage = "https://res.cloudinary.com/dyobirj7r/image/upload/ar_2:1,c_fill,w_800/prod/nfts/bafkreidhkw6zwf46mp4mzjcerqfssjsfcpj3gxukinvee7s4dvzzmguxbi";

  return (<>
    <Head>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <link href={canonical} rel="canonical" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hodlmymoon" />
      <meta name="twitter:creator" content="@hodlmymoon" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
    </Head>

    <div className="blog">
      <HodlBorderedBox sx={{ marginY: 4 }}>
        <MainLinks />
        <h1>The New Year in NFTs</h1>
        <p>This New Year we ran a competition to see how our <strong>frens</strong> on Hodl My Moon spend their New Year</p>
        <p>We also like rewarding members who positively contribute to the site whenever we can.</p>
        <h2>The Competition</h2>
        <p>The competition itself, like most things on <Link href="/">Hodl My Moon</Link>, was minted as an NFT. You can view it <Link href="https://www.hodlmymoon.com/nft/600">here</Link>.</p>
        <p>In short though, you had to:</p>
        <blockquote>Create an original photography NFT of your New Years Eve or New Years Day.</blockquote>
        <p>The best 100 received 5 Matic each.</p>
        <h2>The Outcome</h2>
        <p>We received lots of great entries; and reviewed them all.</p>
        <p>The photography was excellent; and reading the descriptions, with a glass of wine in hand, was somewhat emotional!</p>
        <p>We shared in the hopes and aspirations of everyone. It was also sad to hear of the <Link href={"https://www.hodlmymoon.com/nft/879"}>floods in Semarang, Indonesia</Link>.</p>
        <h2>To The Moon</h2>
        <p>We hope 2023 turns out to be a good one for <strong>everyone</strong>.</p>
        <p>As Bob Marley put it:</p>
        <blockquote>One love, one heart. Let&apos;s get together and feel all right</blockquote>
        <h2>New Year NFT Collage</h2>
        <p>Can you spot yours?</p>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: '1fr 1fr 1fr',
              sm: '1fr 1fr 1fr 1fr 1fr 1fr',
              md: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              lg: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
            }
          }}>
          {
            tokens.map(nft =>
              <NftWindow
                key={nft.id}
                nft={nft}
                sizes="(min-width: 600px) 20vw, (min-width: 900px) 15vw, (min-width: 1200px) calc(1200px / 9), 33vw"
                widths={[600]}
                showAssetType={false}
              />)
          }
        </Box>
        <MainLinks top={false} />
      </HodlBorderedBox>
    </div>
  </>
  )
}
