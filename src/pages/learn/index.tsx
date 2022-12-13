import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { HodlBorderedBox } from '../../components/HodlBorderedBox';
import Button from '@mui/material/Button';
import { HodlShareButton } from '../../components/HodlShareButton';
import Head from 'next/head';

const getData = (root) => {
    const data = new Map;
    const stack = [root];

    while (stack.length !== 0) {
        const folder = stack.pop();

        const dirents = fs.readdirSync(folder, { withFileTypes: true });

        dirents.map(dirent => {
            if (dirent.isDirectory()) {
                stack.push(`${folder}/${dirent.name}`);
            } else {
                if (data.has(folder)) {
                    data.set(folder, [...data.get(folder), dirent.name]);
                } else {
                    data.set(folder, [dirent.name])
                }
            }
        })
    }
    return data;
}

export async function getStaticProps() {
    const root = 'src/posts/learn';

    const data = getData(root);

    const posts = {};
    const categories = {
        'src/posts/learn/nfts': {
            name: 'Non Fungible Tokens',
            description: 'Non Fungible Tokens are digital assets with their ownership recorded on a digital ledger.'
        },
        'src/posts/learn/sign-in': {
            name: 'Sign in to dApps',
            description: 'Sign in to dApps with our visual guides'
        },
        'src/posts/learn/dapps': {
            name: 'Decentralized Applications',
            description: 'Decentralized applications store your data on a blockchain.'
        },
    };
    let re = new RegExp(`${root}\/?`, "g");

    // @ts-ignore
    for (let key of data.keys()) {
        posts[key] = [];
    }

    // @ts-ignore
    for (let [folder, files] of data.entries()) {
        for (let file of files) {
            const relativeFolder = folder.replace(re, '');
            const slug = file.replace('.md', '');

            const url = relativeFolder ? relativeFolder + '/' + slug : slug;
            const readFile = fs.readFileSync(`${folder}/${file}`, 'utf-8');
            const { data: frontmatter } = matter(readFile);

            posts[folder] = posts[folder].concat([{ url, frontmatter: frontmatter }]);
        }
    }

    return {
        props: {
            categories,
            posts
        }
    }
}

export default function Learn({ categories, posts }) {

    const title = "Learn about NFTs, minting, blockchains, smart contracts and everything else";
    const description = "Get an overview of key web3 terms and start your nft journey today";
    const canonical = "https://www.hodlmymoon.com/learn";
    const socialImage = "https://res.cloudinary.com/dyobirj7r/image/upload/ar_216:253,c_fill,w_1080/prod/nfts/bafkreihuew5ij6lvc2k7vjqr65hit7fljl7fsxlikrkndcdyp47xbi6pvy"

    return (<>
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link href={canonical} rel="canonical" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@hodlmymoon" />
            <meta name="twitter:creator" content="@hodlmymoon" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={socialImage} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={title} />
            <meta property="og:image" content={socialImage} />
            <meta property="og:description" content={description} />
        </Head>
        <HodlBorderedBox sx={{ marginY: 4 }}>
            <h1 className='primary-main'>Learn about Web3</h1>
            <div style={{ margin: '0 0 16px 0', display: 'flex', gap: '16px' }}>
                <HodlShareButton />
            </div>
            <p>
                We have beginner friendly guides on NFTs, dApps, and everything you need to know to get up to speed with Web3.
            </p>
            <p>
                This section of the website will be continually growing, so bookmark it now
            </p>
            {Object.keys(categories).map(category => (
                <div key={category}>
                    <h2>{categories[category].name}</h2>
                    <p>{categories[category].description}</p>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr 1fr',
                            },
                            gap: 3,
                            marginBottom: 3,
                            width: '100%',
                        }}>
                        {
                            posts[category]?.map(({ url, frontmatter }) => (<div
                                key={url}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box',
                                    border: '1px solid #ddd',
                                    borderRadius: 8,
                                    overflow: 'hidden'
                                }}>

                                <img src={frontmatter.socialImage} width="100%" style={{ height: 300 }} />
                                <div style={{
                                    padding: `16px`,
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <div
                                        style={{ flexGrow: 1 }}
                                    >
                                        <p style={{ fontWeight: 600 }}>{frontmatter.title}</p>
                                        <p>{frontmatter.metaDescription}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Link href={`/learn/${url}`}>
                                            <Button color="secondary" sx={{ paddingX: 2, paddingY: 1 }}>
                                                Read
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            ))
                        }
                    </Box>
                </div>
            )
            )
            }
            <div style={{ margin: '32px 0 16px 0', display: 'flex', gap: '16px' }}>
                <HodlShareButton />
            </div>
        </HodlBorderedBox >
    </>)
}