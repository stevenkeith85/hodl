import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, Skeleton, Stack } from '@mui/material'
import Link from 'next/link';
import { assetType, ipfsUriToCid, truncateText } from '../lib/utils';
import { ProfileAvatar } from './avatar/ProfileAvatar';
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

const Overlay = ({ nft }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    return (<Link
        href={`/nft/${nft?.id}`}>
        <Box
            className='nftItemOverlay'
            position="absolute"
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            sx={{
                background: "rgba(0,0,0,0.35)",
                opacity: matches ? 0 : 1, // always show on mobiles as they don't really have hover effects
                cursor: 'pointer'
            }}
        >
            <Box display="flex" flexDirection="column" gap={2}>
                <Box
                    display="flex"
                    gap={2}
                    justifyContent="center"
                    width="100%"
                    alignItems={"center"}
                >
                    {/* <ProfileAvatar
                    size="large"
                    profileAddress={nft?.owner}
                    color="greyscale"
                    showNickname={false}
                    highlight={true}
                /> */}
                </Box>
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
                            token={true}
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
        </Box>
    </Link>)
}

const NftList = ({
    nfts,
}) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                },
                gridGap: 16,
                [`& .${imageListItemClasses.root}`]: {
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {(nfts || []).filter(nft => nft).map((nft: Token) => (
                <ImageListItem key={nft.id} sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    '&:hover': {
                        '.nftItemOverlay': {
                            opacity: 1
                        },
                    }
                }}>
                    <Box>
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
                                    preload="none"
                                    audio={assetType(nft) === AssetTypes.Audio}
                                    height={matches ? '400px' : '500px'}
                                />
                            </Box>
                        }
                        {assetType(nft) === AssetTypes.Image &&
                            <HodlImage
                                cid={nft?.image}
                                effect={nft?.filter}
                                height={matches ? '400px' : '500px'}
                            />
                        }
                    </Box>
                    <Overlay nft={nft} />
                </ImageListItem>
            )
            )}
        </Box>
    )
}

export default NftList
