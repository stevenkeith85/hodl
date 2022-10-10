import { Box, Skeleton } from '@mui/material'
import Link from 'next/link';
import { assetType } from '../lib/utils';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Comments } from './comments/Comments';
import { GifBoxOutlined, Image, ImageOutlined, MusicNote, MusicNoteOutlined, Videocam, VideocamOffOutlined, VideocamOutlined } from '@mui/icons-material'
import { AssetTypes } from '../models/AssetType';
import { HodlImageResponsive } from './HodlImageResponsive';
import { HodlAudioBox } from './HodlAudioBox';
import { Nft } from '../models/Nft';
import { PriceSticker } from './PriceSticker';

interface OverlayProps {
    nft: Nft;
}
const Overlay: React.FC<OverlayProps> = ({
    nft
}) => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Box
            className='nftItemOverlay'

            sx={{
                background: "rgba(0,0,0,0.5)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: `100%`,
                opacity: 0,
                top: 0,
                left: 0,
                position: 'absolute',
                zIndex: 1,
                color: 'white'
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                    gap: {
                        xs: 0,
                        sm: 1
                    }
                }}
            >

                <Box
                    display="flex"
                    width="100%"
                    justifyContent="center"
                    alignItems={"center"}
                    sx={{
                        height: '44px'
                    }}
                >
                    <Box
                        display="flex"

                        sx={{
                            color: 'white',
                            gap: {
                                xs: 2,
                                sm: 3
                            },
                        }}
                    >
                        <Likes
                            id={nft?.id}
                            object="token"
                            color='inherit'
                            fontSize={xs ? 14 : 18}
                            size={xs ? 20 : 22}
                            sx={{
                                cursor: 'pointer',
                                color: 'white',

                            }}
                        />
                        <Comments
                            nft={nft}
                            color='inherit'
                            fontSize={xs ? 14 : 18}
                            size={xs ? 20 : 22}
                            sx={{
                                paddingRight: 0,
                            }}

                        />
                    </Box>
                </Box>
            </Box>
        </Box >)
}

interface NftWindowProps {
    nft: Nft;
}
export const NftWindow: React.FC<NftWindowProps> = ({
    nft
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
                        <GifBoxOutlined sx={{ position: 'absolute', top: 8, left: 8 }} />
                        <HodlVideo
                            cid={nft?.properties?.asset?.uri}
                            assetFolder="image"
                            gif={true}
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
                        <VideocamOutlined sx={{ position: 'absolute', top: 8, left: 8 }} />
                        <HodlImageResponsive
                            sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw"
                            cid={nft?.image}
                            widths={[400, 800, 1000]}
                            aspectRatio="1:1"
                            objectFit='cover'
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
                        <MusicNoteOutlined sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} />
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
                            height: '100%',
                            position: 'relative'
                        }}>
                        <ImageOutlined sx={{ position: 'absolute', top: 8, left: 8 }} />
                        <HodlImageResponsive
                            aspectRatio="1:1"
                            sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw, 100vw"
                            cid={nft?.properties?.asset?.uri}
                            widths={[400, 800, 1000]}
                            objectFit="cover"
                        />
                    </Box>
                }
                {!xs && <Overlay nft={nft} />}
                {nft?.forSale && <PriceSticker price={nft?.price} />}
            </Box>
        </Link>
    )
}