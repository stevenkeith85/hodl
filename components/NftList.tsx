import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, Skeleton } from '@mui/material'
import Link from 'next/link';
import { assetType, createCloudinaryUrl, truncateText } from '../lib/utils';
import { useTheme } from '@mui/material/styles';
import { ProfileAvatar } from './ProfileAvatar';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { HodlImage2 } from './HodlImage2';

const NftList = ({
    nfts,
    showTop = true,
    showBottom = true,
    showAvatar = true,
    showName = true,
    gridColumns = null,
    imgHeight = null,
    onClick = null,
    highlightNft = null
}) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: gridColumns ? gridColumns : {
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
                <ImageListItem key={i} onClick={() => {
                    if (onClick) {
                        onClick(nft.tokenId)
                    }
                }}>
                    <Box sx={{
                        display: 'flex',
                        position: 'relative',
                        padding: 0,
                        borderRadius: 1,
                        height: '100%',
                        img: {
                            border: highlightNft ? '2px solid' : 'none',
                            borderColor: highlightNft == nft.tokenId ? theme => theme.palette.secondary.main : 'transparent',
                            borderRadius: 1,
                            height: imgHeight || {
                                xs: 500,
                                sm: 400
                            }
                        },
                        video: {
                            objectFit: 'cover',
                            borderRadius: 1,
                            height: imgHeight || {
                                xs: 500,
                                sm: 400
                            }
                        }
                    }}
                    >
                        {/* <img
                            style={{
                                position: 'absolute',
                                zIndex: -1,
                                width: '100%',
                                objectFit: "cover",
                            }}
                            decoding="async"
                            loading="eager"
                            alt={nft?.name}
                            src={`${createCloudinaryUrl(assetType(nft) === 'image' ? 'image': 'videos', 'upload', `c_limit,f_auto,q_1,h_350${nft?.filter ? ',' + nft?.filter : ''}`, 'nfts', nft.image)}`}
                        /> */}

                        {assetType(nft) === 'gif' && <HodlVideo sx={{ video: { width: '100%' } }} cid={nft?.image} transformations={nft?.filter} gif={true} />}
                        {assetType(nft) === 'video' && <HodlVideo cid={nft?.image} controls={false} onlyPoster={true} transformations='l_text:Arial_100_bold:VIDEO,co_rgb:FFFFFF' />}
                        {assetType(nft) === 'image' && <HodlImage2
                            image={nft?.image}
                            alt={nft?.name}
                            effect={nft?.filter}
                            imgSizes={
                                "(max-width:599px) 600px, (max-width:899px) 450px, (max-width:1199px) 400px, 300px"
                            }
                        />}

                    </Box>
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
                                {showAvatar && <ProfileAvatar size="small" profileAddress={nft.seller} color="greyscale" />}
                                {showName && <Typography sx={{ paddingY: 1 }}>{truncateText(nft.name, 20)}</Typography>}
                                {Boolean(nft?.price) &&
                                    <Typography>{`${nft.price} Matic`}</Typography>
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
                                <Likes tokenId={nft?.tokenId} />
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
