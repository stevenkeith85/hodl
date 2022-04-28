import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, Skeleton } from '@mui/material'
import Link from 'next/link';
import { assetType, truncateText } from '../lib/utils';
import { ProfileAvatar } from './ProfileAvatar';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { HodlImage } from './HodlImage';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const NftList = ({
    nfts,
    showTop=true,
    showBottom=true,
    showAvatar=true,
    showName=true,
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
                <ImageListItem key={i}>
                        {assetType(nft) === 'gif' &&
                            <HodlVideo
                                cid={nft?.image}
                                transformations={nft?.filter}
                                gif={true}
                                height={matches ? '400px': '500px'}
                            />}
                        {assetType(nft) === 'video' &&
                            <HodlVideo
                                cid={nft?.image}
                                controls={false}
                                onlyPoster={true}
                                preload="none"
                                transformations='l_text:Arial_100_bold:VIDEO,co_rgb:FFFFFF'
                                height={matches ? '400px': '500px'}
                            />
                            }
                        {assetType(nft) === 'image' &&
                            <HodlImage
                                cid={nft?.image}
                                effect={nft?.filter}
                                height={matches ? '400px': '500px'}
                            />
                            }
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
                                        profileAddress={nft?.seller} 
                                        color="greyscale" 
                                />}
                                {showName && 
                                    <Typography 
                                        sx={{ paddingY: 1 }}
                                    >
                                        {truncateText(nft.name, 20)}
                                    </Typography>}
                                {nft?.price &&
                                    <Typography>
                                        {`${nft.price} Matic`}
                                    </Typography>
                                }
                            </Box>
                        }
                    />
                    <ImageListItemBar
                        sx={{
                            display: () => showBottom ? 'flex' : 'none',
                        }}
                        title={
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: "center",
                            }}>
                                <Likes 
                                    tokenId={nft?.tokenId} 
                                />
                                <Link href={`/nft/${nft?.tokenId}`}>
                                    <Button
                                        sx={{
                                            borderColor: 'rgba(255, 255, 255, 0.9)',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            paddingY: 0.5,
                                            '&:hover': {
                                                borderColor: 'white',
                                                color: 'white',
                                                background: 'rgba(255, 255, 255, 0.35)',
                                            }
                                        }}
                                    >
                                        View
                                    </Button>
                                </Link>
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
