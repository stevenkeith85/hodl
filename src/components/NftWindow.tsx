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
import { FullToken } from '../models/Nft';
import { PriceSticker } from './PriceSticker';

// import { NftWindowOverlay } from "./NftWindowOverlay";

const NftWindowOverlay = dynamic(
    () => import('./NftWindowOverlay').then(mod => mod.NftWindowOverlay),
    {
        loading: () => <div>...</div>
    }
);

interface NftWindowProps {
    nft: FullToken;
    lcp?: boolean; // if this window will be the largest content paint, then set to true
}

export const NftWindow: React.FC<NftWindowProps> = ({
    nft,
    lcp = false
}) => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    if (!nft) {
        return <Skeleton sx={{ width: '100%', height: 0, paddingTop: '100%' }} variant="rectangular" animation="wave" />
    }

    return (
        <Link
            key={nft.id}
            href={nft?.forSale ? `/nft/${nft.id}?tab=1` : `/nft/${nft.id}`}
            passHref
        >

            <Box
                component="a"
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
                            sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw"
                            cid={nft?.properties?.asset?.uri}
                            widths={[400, 800, 1000]}
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
                            sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw"
                            cid={nft?.image}
                            widths={[400, 800, 1000]}
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
                            sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw, 100vw"
                            cid={nft?.properties?.asset?.uri}
                            widths={[400, 800, 1000]}
                        />
                    </Box>
                }
                {!xs && <NftWindowOverlay nft={nft} />}
                {nft?.forSale && <PriceSticker price={nft?.price} />}
            </Box>

        </Link>

    )
}
