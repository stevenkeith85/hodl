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
                    '.itemImage': {
                        transition: theme.transitions.create(['transform'], {
                            duration: theme.transitions.duration.standard,
                        }),
                        '&:hover': {
                            transform: 'scale(1.05)',
                        }
                    },

                }}>
                    <Link href={`/nft/${nft?.tokenId}`}>
                        <Box className="itemImage" sx={{ cursor: 'pointer' }}>
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
                    </Link>
                    <ImageListItemBar
                        sx={{
                            display: () => showTop ? 'flex' : 'none',
                        }}
                        position="top"
                        title={
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: "center",
                            }}>
                                {showAvatar &&
                                    <ProfileAvatar
                                        size="small"
                                        profileAddress={nft?.seller || nft?.owner}
                                        color="greyscale"
                                    />}
                                {showName &&
                                    <Typography
                                        sx={{ paddingY: 1 }}
                                    >
                                        {truncateText(nft.name, 20)}
                                    </Typography>}
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
                                    <img src="/matic.svg" width={16} height={16} />
                                    <Typography sx={{ lineHeight: 1}}>{nft.price}</Typography>
                                </Box>

                                }
                            </Box>
                        }
                    />
                    <ImageListItemBar
                        sx={{
                            display: () => showBottom ? 'flex' : 'none',
                        }}
                        title={
                            <Box display="flex" alignItems="center" gap={1} paddingY={1}>
                                <Likes
                                    id={nft?.tokenId}
                                    token={true}
                                    color='inherit'
                                />
                                <Comments nft={nft} color='inherit' />
                            </Box>

                        }
                    />
                </ImageListItem>
            )
            )}
        </Box>
    )
}

export default NftList
