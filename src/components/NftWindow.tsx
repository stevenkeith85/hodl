import Link from 'next/link';
import dynamic from 'next/dynamic';

import { assetType } from "../lib/assetType";
import { AssetTypes } from '../models/AssetType';
import { HodlImageResponsive } from './HodlImageResponsive';

const HodlAudioBox = dynamic(
    () => import('./HodlAudioBox').then(mod => mod.HodlAudioBox),
    {
        ssr: false,
        loading: () => null
    }
);

const PriceSticker = dynamic(
    () => import('./PriceSticker').then(mod => mod.PriceSticker),
    {
        ssr: false,
        loading: () => null
    }
);

const GifBoxOutlinedIcon = dynamic(
    () => import('@mui/icons-material/GifBoxOutlined'),
    {
        ssr: false,
        loading: () => null
    }
);

const ImageOutlinedIcon = dynamic(
    () => import('@mui/icons-material/ImageOutlined'),
    {
        ssr: false,
        loading: () => null
    }
);
const MusicNoteOutlinedIcon = dynamic(
    () => import('@mui/icons-material/MusicNoteOutlined'),
    {
        ssr: false,
        loading: () => null
    }
);
const VideocamOutlinedIcon = dynamic(
    () => import('@mui/icons-material/VideocamOutlined'),
    {
        ssr: false,
        loading: () => null
    }
);

interface NftWindowProps {
    nft: any;
    sizes?: string;
    widths?: number[],
    lcp?: boolean; // if this window will be the largest content paint, then set to true
}

export const NftWindow: React.FC<NftWindowProps> = ({
    nft,
    sizes = "(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw",
    widths = [600, 700, 800, 900, 1080],
    lcp = false
}) => {
    return (
        <div
            style={{
                position: 'relative',
                overflow: 'hidden',
                width: `100%`,
                height: '100%',
                display: 'block',
            }}>
            <Link
                key={nft?.id}
                href={nft?.forSale ? `/nft/${nft?.id}?tab=1` : `/nft/${nft?.id}`}
            >
                {
                    assetType(nft) === AssetTypes.Gif &&
                    <div
                        style={{
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
                    </div>
                }
                 {
                    assetType(nft) === AssetTypes.Video &&
                    <div
                        style={{
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
                    </div>
                }
                {
                    assetType(nft) === AssetTypes.Audio &&
                    <div
                        style={{
                            position: 'relative',
                            color: 'white',
                        }}>
                        <MusicNoteOutlinedIcon sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} />
                        <HodlAudioBox token={nft} audio={false} minHeight={1000} size={50} />
                    </div>
                }
                {
                    assetType(nft) === AssetTypes.Image &&
                    <div
                        style={{
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
                            lcp={lcp}
                            aspectRatio="1:1"
                            sizes={sizes}
                            cid={nft?.properties?.asset?.uri}
                            widths={widths}
                        />
                    </div>
                } 
                {nft?.forSale && <PriceSticker price={nft?.price} />}
            </Link>
        </div>
    )
}
