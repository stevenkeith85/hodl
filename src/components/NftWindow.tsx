import { Box } from '@mui/material'
import Link from 'next/link';
import { assetType } from '../lib/utils';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Comments } from './comments/Comments';
import { Videocam } from '@mui/icons-material'
import { AssetTypes } from '../models/AssetType';
import { MaticPrice } from './MaticPrice';
import { HodlImageResponsive } from './HodlImageResponsive';


const Overlay = ({ nft }) => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Box
            className='nftItemOverlay'

            sx={{
                background: "rgba(0,0,0,0.35)",
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

export const NftWindow = ({ nft, aspectRatio = "1:1" }) => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    if (!nft) {
        return null;
    }

    return (
        <Link key={nft.id} href={nft?.forSale ? `/nft/${nft.id}?tab=1` : `/nft/${nft.id}`} passHref>
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
                {assetType(nft) === AssetTypes.Gif &&
                    <HodlVideo
                        cid={nft?.image}
                        // transformations={nft?.filter}
                        gif={true}
                    />}
                {(assetType(nft) === AssetTypes.Video || assetType(nft) === AssetTypes.Audio) &&
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        {assetType(nft) === AssetTypes.Video && <Videocam fontSize="large" sx={{ position: 'absolute' }} />}
                        <HodlVideo
                            cid={nft?.image}
                            controls={false}
                            onlyPoster={true}
                            audio={assetType(nft) === AssetTypes.Audio}
                        />
                    </Box>
                }
                {assetType(nft) === AssetTypes.Image &&
                    <>
                        <HodlImageResponsive
                            aspectRatio="1:1"
                            sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 5 * 2), 50vw"
                            cid={nft?.image}
                            widths={[400, 800, 1000]}
                            objectFit="cover"
                        />
                    </>
                }
                <Overlay nft={nft} />

                {nft?.forSale &&

                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: `auto`,
                                height: `auto`,
                                padding: 1.5,
                                paddingY: 0.75,
                                background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.225), rgba(0,0,0,0.25), rgba(0,0,0,0.225), rgba(0,0,0,0.2))`,
                            }}
                        >
                            <Box
                                sx={{
                                    textAlign: 'right'
                                }}>
                                <MaticPrice
                                    price={nft?.price}
                                    fontSize={xs ? 14 : 16}
                                    size={xs ? 14 : 16}
                                    humanizeNumber={true}
                                />
                            </Box>
                        </Box>
                }
            </Box>
        </Link>
    )
}