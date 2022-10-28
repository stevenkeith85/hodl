import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';
import { assetType } from '../../lib/utils';
import { AssetTypes } from '../../models/AssetType';
import { Token } from '../../models/Token';
import { HodlAudioBoxMini } from '../HodlAudioBoxMini';
import { HodlImageResponsive } from '../HodlImageResponsive';


interface TokenLinkProps {
    token: Token;
    size?: number;
    fontSize?: number;
}

export const TokenLink: React.FC<TokenLinkProps> = ({ token, size = 44, fontSize = 14 }) => {
    const [loading, setLoading] = useState(true);

    const asset = <>
        {token?.properties?.asset?.uri &&
            <Box
                sx={{
                    width: size,
                    height: size
                }}
            >
                {assetType(token) === AssetTypes.Image &&
                    <HodlImageResponsive
                        assetFolder="image"
                        folder="nfts"
                        cid={token?.properties?.asset?.uri}
                        aspectRatio="1:1"
                        widths={[44, 88]}
                        sizes={`${size}px`}
                        onLoad={() => setLoading(false)}
                    />
                }
                {assetType(token) === AssetTypes.Video &&
                    <HodlImageResponsive
                        assetFolder="image"
                        folder="nfts"
                        cid={token?.image}
                        aspectRatio="1:1"
                        widths={[44, 88]}
                        sizes={`${size}px`}
                        onLoad={() => setLoading(false)}
                    />
                }
                {assetType(token) === AssetTypes.Gif &&
                    <HodlImageResponsive
                        assetFolder="image"
                        folder="nfts"
                        cid={token?.image}
                        aspectRatio="1:1"
                        widths={[44, 88]}
                        sizes={`${size}px`}
                        onLoad={() => setLoading(false)}
                        extension="jpg"
                    />
                }
                {assetType(token) === AssetTypes.Audio &&
                    <HodlAudioBoxMini size={size} />
                }
            </Box>
        }</>

    const name = <Typography sx={{
        fontSize,
        color: theme => theme.palette.text.secondary
    }}>{token?.name}</Typography>


    return (<>
        {loading &&
            <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                    cursor: 'pointer',
                }}
            >
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                >
                    {asset}
                </Skeleton>
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                >
                    {name}
                </Skeleton>
            </Box>
        }
        <Box sx={{
            display: loading ? 'none' : 'block'
        }}>
            <Link href={`/nft/${token.id}`} passHref>
                <Typography component="span" sx={{
                    textDecoration: 'none',
                    color: '#333'
                }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        {asset}
                        {name}
                    </Box>
                </Typography>
            </Link>
        </Box>
    </>)
}
