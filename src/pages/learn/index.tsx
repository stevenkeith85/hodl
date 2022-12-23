import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { HodlBorderedBox } from '../../components/HodlBorderedBox';
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
            description: 'Non Fungible Tokens are digital assets with their ownership recorded on a blockchain.'
        },
        'src/posts/learn/sign-in': {
            name: 'Sign in to DApps',
            description: 'Sign in to decentralized applications with our visual guides'
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
    const title = "Learn about NFTs and Decentralized Applications";
    const description = "Take your NFT knowledge to the next level with us.";
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
        <div className='blog'>
            <HodlBorderedBox sx={{ marginY: 4 }}>
                <div style={{ margin: '0 0 32px 0', display: 'flex', gap: '16px' }}>
                    <HodlShareButton />
                </div>
                <h1 className='primary-main'>Learn about NFTs and DApps</h1>
                <div style={{ marginBottom: '32px' }}>
                    <p>
                        The best way to learn about NFTs and DApps is with Hodl My Moon.
                    </p>
                    <p>
                        We have beginner friendly guides on NFTs, DApps, and everything you need to know to get up to speed with Web3.
                    </p>
                    <p>
                        Anyone can create an NFT, and we are here to show you how.
                    </p>
                </div>
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
                                marginY: 4,
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

                                    <div style={{ height: 0, paddingTop: "100%", position: 'relative' }}>
                                        <Link href={`/learn/${url}`}>
                                            <img src={frontmatter.socialImage} style={{ width: "100%", height: '100%', position: 'absolute', top: 0 }} />
                                        </Link>
                                    </div>

                                    <div style={{
                                        padding: `24px 16px 16px`,
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <p style={{ fontWeight: 600 }}>{frontmatter.title}</p>
                                            <p>{frontmatter.metaDescription}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <Button
                                                LinkComponent={Link}
                                                href={`/learn/${url}`}
                                                color="secondary"
                                                sx={{ paddingX: 2, paddingY: 1 }}
                                            >
                                                Read
                                            </Button>
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
        </div>
    </>)
}