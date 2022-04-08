import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, IconButton, Stack } from '@mui/material'
import Link from 'next/link';
import { assetType, createCloudinaryUrl, truncateText } from '../lib/utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { HodlImage } from './HodlImage';
import { ProfileAvatar } from './ProfileAvatar';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { HodlImage2 } from './HodlImage2';

const NftList = ({ nfts, viewSale = false, showTop = true }) => {
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
                marginTop: 2,
                marignBottom: 2,
                [`& .${imageListItemClasses.root}`]: {
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {nfts.filter(nft => nft).map((nft, i) => (
                <ImageListItem key={i} >
                    <Box  sx={{ 
                        display: 'block', 
                        position: 'relative',
                        padding: 0,
                        borderRadius: 1,
                        height: {
                            xs: 500, 
                            sm: 400
                        },
                        img: {
                            borderRadius: 1,
                            height: {
                                xs: 500,
                                sm: 400
                            }
                        },
                        video: {
                            objectFit: 'cover',
                            borderRadius: 1,
                            height: {
                                xs: 500,
                                sm: 400
                            }
                        }
                        }}

                    >
                        { assetType(nft) === 'gif' && <HodlVideo cid={nft?.image} gif={true}/> }
                        { assetType(nft) === 'video' && <HodlVideo cid={nft?.image} controls={false} onlyPoster={true} transformations='l_text:Arial_100_bold:VIDEO,co_rgb:FFFFFF'/> }
                        { assetType(nft) === 'image' &&
                            <>
                            <img 
                                style={{
                                    position: 'absolute',
                                    zIndex: -1,
                                    width: '100%',
                                    objectFit: "cover",
                                }}
                                decoding="async"
                                loading="eager"
                                src={`${createCloudinaryUrl('image', 'upload', `f_auto,q_10,h_350,e_grayscale`, 'nfts', nft.image)}`}
                            />
                            { matches ?
                            // <HodlImage 
                            //     sx={{
                            //         borderRadius: 1,
                            //         height: {
                            //             xs: 500,
                            //             sm: 400
                            //         }
                            //     }} 
                            //     image={nft?.image} 
                            //     imgSizes={"(max-width:599px) 100vw, (max-width:899px) 50vw, (max-width:1199px) 33vw, 25vw"} 
                            //     filter={nft?.filter}
                            // /> :
                            <HodlImage2
                                image={nft?.image}
                                effect={nft?.filter}
                                imgSizes={"(max-width:599px) 100vw, (max-width:899px) 50vw, (max-width:1199px) 33vw, 25vw"}
                                /> : 
                            // <HodlImage 
                            //     sx={{
                            //         borderRadius: 1,
                            //         height: {
                            //             xs: 500,
                            //             sm: 400
                            //         }
                            //     }} 
                            //     image={nft?.image} 
                            //     imgSizes={"100vw"} 
                            //     filter={nft?.filter}
                            // />
                            <HodlImage2
                                image={nft?.image}
                                effect={nft?.filter}
                                imgSizes={"100vw"} 
                                />
                        }
                    </>
}
                    </Box>
                    <ImageListItemBar
                        sx={{
                            display: () => showTop ? 'flex' : 'none',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            borderTopLeftRadius: 1,
                            borderTopRightRadius: 1,
                            '.MuiImageListItemBar-titleWrap': {
                                padding: 2
                            }
                        }}
                        
                        position="top"
                        title={
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: "center",
                                }}>
                                <ProfileAvatar size="small" profileAddress={nft.seller} color="greyscale"/>
                                {Boolean(nft?.price) &&
                                    <Typography sx={{ fontWeight: 900 }}>{`${nft.price} Matic`}</Typography>
                                }
                            </Box>
                        }
                    />
                    <ImageListItemBar
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            borderBottomLeftRadius: 1,
                            borderBottomRightRadius: 1,
                            paddingTop: 1,
                            paddingBottom: 1,
                            '.MuiImageListItemBar-titleWrap': {
                                padding: 2
                            }
                        }}
                        subtitle={
                            <Stack>
                                <Likes token={nft} />
                            </Stack>
                        }
                        actionIcon={
                            Boolean(nft?.tokenId) && <Link 
                                href={viewSale ? `/nft/${nft?.tokenId}` : `/nft/${nft?.tokenId}`}
                            >
                                 <Button
                                    variant="outlined"
                                    sx={{ 
                                        borderColor: 'rgba(255, 255, 255, 0.9)',
                                        marginRight: 2,
                                        borderWidth: 1.5,
                                        color: 'rgba(255, 255, 255, 0.9)',

                                        fontWeight: 900,
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
                        }
                    />
                </ImageListItem>
            )
            )}

        </Box>
    )
}

export default NftList
