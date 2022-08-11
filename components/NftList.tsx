import { Box, imageListItemClasses, ImageListItem } from '@mui/material'
import Link from 'next/link';
import { assetType } from '../lib/utils';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { HodlImage } from './HodlImage';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Comments } from './comments/Comments';
import { Videocam } from '@mui/icons-material'
import { AssetTypes } from '../models/AssetType';
import { MaticPrice } from './MaticPrice';
import { Token } from '../models/Token';
import { Nft } from '../models/Nft';
import { HodlImageResponsive } from './HodlImageResponsive';

const Overlay = ({ nft }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Box
            className='nftItemOverlay'
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            sx={{
                background: "rgba(0,0,0,0.35)",
                opacity: matches ? 0 : 1, // always show on mobiles as they don't really have hover effects
                top: 0,
                position: 'absolute'
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
                    <Box display="flex"
                        gap={3}>
                        <Likes
                            id={nft?.id}
                            object="token"
                            color='inherit'
                            fontSize='26px'
                        />
                        <Comments
                            nft={nft}
                            color='inherit'
                            fontSize='26px'
                            sx={{ paddingRight: 0 }}
                        />
                        {nft?.price && <MaticPrice nft={nft} />}
                    </Box>
                </Box>
            </Box>
        </Box>)
}

const NftList = ({ nfts }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Box
            sx={{ 
                display: "grid", 
                gridTemplateColumns: {
                    xs: `1fr 1fr`,
                    sm: `1fr 1fr 1fr 1fr`
                },
                gap: 4
            }}
        >
            {
                nfts.map((nft: Nft) => (
                    <Link href={`/nft/${nft.id}`} passHref>
                        <Box
                            component="a"
                            sx={{
                                position: 'relative',

                                '&:hover': {
                                    '.nftItemOverlay': { opacity: 1 }
                                }
                            }}>
                            {assetType(nft) === AssetTypes.Gif &&
                                <HodlVideo
                                    cid={nft?.image}
                                    transformations={nft?.filter}
                                    gif={true}
                                    height={matches ? '400px' : '500px'}
                                />}
                            {(assetType(nft) === AssetTypes.Video || assetType(nft) === AssetTypes.Audio) &&
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    {assetType(nft) === AssetTypes.Video && <Videocam fontSize="large" sx={{ position: 'absolute' }} />}
                                    <HodlVideo
                                        cid={nft?.image}
                                        controls={false}
                                        onlyPoster={true}
                                        audio={assetType(nft) === AssetTypes.Audio}
                                        height={matches ? '400px' : '500px'}
                                    />
                                </Box>
                            }
                            {assetType(nft) === AssetTypes.Image &&
                                <>
                                    <HodlImageResponsive
                                        aspectRatio="1:1"
                                        sizes="(min-width: 900px) 25vw, (min-width: 1200px) calc(1200px / 4), 50vw"
                                        cid={nft?.image}
                                        widths={[400, 800, 1000]}
                                        gravity="g_face"
                                    />
                                </>
                            }
                            {/* <Overlay nft={nft} /> */}
                        </Box>
                    </Link>
                ))
            }
        </Box>
    );
}


export default NftList
