import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { memo } from 'react';
import { assetType } from "../../lib/assetType";
import { AssetTypes } from '../../models/AssetType';
import { Token } from "../../models/Token";

import dynamic from 'next/dynamic';

const HodlAudioBoxMini = dynamic(
    () => import('../HodlAudioBoxMini').then(mod => mod.HodlAudioBoxMini),
    {
        ssr: false,
        loading: () => null
    }
);

const HodlImageResponsive = dynamic(
    () => import('../HodlImageResponsive').then(mod => mod.HodlImageResponsive),
    {
        ssr: true,
        loading: () => null
    }
);

interface TokenLinkProps {
    token: Token;
    size?: number;
    fontSize?: number;
}

export const TokenLink: React.FC<TokenLinkProps> = memo(({ token, size = 44, fontSize = 14 }) => {

    return (<>
        <Box
            display="flex"
            alignItems="center"
            gap={2}
        >
            {token?.properties?.asset?.uri &&
                <Link style={{ textDecoration: 'none' }} href={`/nft/${token.id}`}>
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
                                extension="jpg"
                            />
                        }
                        {assetType(token) === AssetTypes.Audio &&
                            <HodlAudioBoxMini size={size} />
                        }
                    </Box>
                </Link>
            }
            <Link
                style={{ textDecoration: 'none' }}
                href={`/nft/${token.id}`}
            >
                <Typography
                    sx={{
                        fontSize,
                        color: theme => theme.palette.text.secondary,
                        textDecoration: 'none'
                    }}>
                    {token?.name}
                </Typography>
            </Link>
        </Box>
    </>)
})

TokenLink.displayName = "TokenLink"