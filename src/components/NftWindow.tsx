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
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

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
                opacity: matches ? 0 : 1, // always show on mobiles as they don't really have hover effects
                top: 0,
                left: 0,
                position: 'absolute',
                zIndex: 1,
                color: 'white'
            }}
        >
            <Box display="flex" flexDirection="column" gap={2}>
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
                                xs: 1,
                                sm: 2
                            },
                        }}
                    >
                        <Likes
                            id={nft?.id}
                            object="token"
                            color='inherit'
                            fontSize={matches ? '26px': '14px'}
                            sx={{
                                cursor: 'pointer',
                                color: 'white',
                                
                            }}
                        />
                        <Comments
                            nft={nft}
                            color='inherit'
                            fontSize={matches ? '26px': '14px'}
                            sx={{
                                paddingRight: 0,
                            }}

                        />
                        {nft?.forSale && <MaticPrice price={nft?.price} size={26} fontSize={16}/>}
                    </Box>
                </Box>
            </Box>
        </Box >)
}

export const NftWindow = ({ nft, aspectRatio = "1:1" }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    if (!nft) {
        return null;
    }

    return (
        <Link key={nft.id} href={`/nft/${nft.id}`} passHref>
            <Box
                component="a"
                sx={{
                    position: 'relative',
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
                        transformations={nft?.filter}
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
                            gravity="g_face"
                            objectFit="cover"
                        />
                    </>
                }
                <Overlay nft={nft} />
            </Box>
        </Link>
    )
}