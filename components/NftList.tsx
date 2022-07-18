import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, Skeleton, Stack } from '@mui/material'
import Link from 'next/link';
import { assetType, truncateText } from '../lib/utils';
import { ProfileAvatar } from './avatar/ProfileAvatar';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { HodlImage } from './HodlImage';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Comments } from './comments/Comments';
import { Videocam } from '@mui/icons-material'
import { AssetTypes } from '../models/AssetType';
import { ProfileNameOrAddress } from './avatar/ProfileNameOrAddress';

const NftList = ({
    nfts,
    showTop = true,
    showBottom = true,
    showAvatar = true,
    showName = true,
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
            {(nfts || []).filter(nft => nft).map((nft, i) => (

                <ImageListItem key={i} sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    '&:hover': {
                        
                        '.nftItemOverlay': {
                            // transition: 'opacity 200ms ease-in',
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

                    <Link
                        href={`/nft/${nft?.tokenId}`}>
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
                                opacity: 0,
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
                                    <ProfileAvatar
                                        size="large"
                                        profileAddress={nft?.owner}
                                        color="greyscale"
                                        showNickname={false}
                                        highlight={true}
                                    />
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
                                            id={nft?.tokenId}
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
                                        {nft?.price && <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={0.5}
                                            sx={{
                                                'img': {
                                                    filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                                                }
                                            }}
                                        >
                                            <img src="/matic.svg" width={26} height={26} />
                                            <Typography sx={{ fontSize: '22px' }}>{nft.price}</Typography>
                                        </Box>}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Link>
                </ImageListItem>
            )
            )}
        </Box>
    )
}

export default NftList
