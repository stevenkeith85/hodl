import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

import { assetType } from '../lib/utils';
import { AssetTypes } from '../models/AssetType';
import { HodlImageResponsive } from './HodlImageResponsive';
import { HodlAudioBox } from './HodlAudioBox';
import { FullToken } from "../models/FullToken";
import { PriceSticker } from './PriceSticker';
import { TokenVM } from '../models/TokenVM';

const NftWindowOverlay = dynamic(
    () => import('./NftWindowOverlay').then(mod => mod.NftWindowOverlay),
    {
        ssr: false,
        loading: () => null
    }
);

interface NftWindowProps {
    nft: any;
    sizes?: string;
    widths?: number [],
    lcp?: boolean; // if this window will be the largest content paint, then set to true
}

export const NftWindow: React.FC<NftWindowProps> = ({
    nft,
    sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw",    
    widths=[600, 700, 800, 900, 1080],
    lcp = false
}) => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    if (!nft) {
        return <Skeleton sx={{ width: '100%', height: 0, paddingTop: '100%' }} variant="rectangular" animation="wave" />
    }

    return (
        
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: `100%`,
                    height: '100%',
                    display: 'block',

                    '&:hover': {
                        '.nftItemOverlay': { opacity: 1 }
                    }
                }}>
                    <Link
            key={nft.id}
            href={nft?.forSale ? `/nft/${nft.id}?tab=1` : `/nft/${nft.id}`}
        >
                {
                    assetType(nft) === AssetTypes.Gif &&
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            height: '100%',
                            position: 'relative'
                        }}>
                        <GifBoxOutlinedIcon sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} />
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            lcp={lcp}
                            sizes={sizes}
                            cid={nft?.properties?.asset?.uri}
                            widths={widths}
                            aspectRatio="1:1"
                            extension="jpg"
                        />
                    </Box>
                }
                {
                    assetType(nft) === AssetTypes.Video &&
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            height: '100%',
                            position: 'relative'
                        }}>
                        <VideocamOutlinedIcon sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} />
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            lcp={lcp}
                            sizes={sizes}
                            cid={nft?.image}
                            widths={widths}
                            aspectRatio="1:1"
                        />
                    </Box>
                }
                {
                    assetType(nft) === AssetTypes.Audio &&
                    <Box
                        sx={{
                            position: 'relative',
                            color: 'white',
                        }}>
                        <MusicNoteOutlinedIcon sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} />
                        <HodlAudioBox token={nft} audio={false} minHeight={1000} size={50} />
                    </Box>
                }
                {
                    assetType(nft) === AssetTypes.Image &&
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            width: '100%',
                            height: '100%',
                            position: 'relative'
                        }}>
                        <ImageOutlinedIcon sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} />
                        <HodlImageResponsive
                            assetFolder={"image"}
                            folder="nfts"
                            lcp={true}
                            aspectRatio="1:1"
                            sizes={sizes}
                            cid={nft?.properties?.asset?.uri}
                            widths={widths}
                        />
                    </Box>
                }
                {nft?.forSale && <PriceSticker price={nft?.price} />}
                {!xs && <NftWindowOverlay nft={nft} />}
                </Link>
            </Box>

        

    )
}
