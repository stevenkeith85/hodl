import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, Stack } from '@mui/material'
import Link from 'next/link';
import { assetType, createCloudinaryUrl, truncateText } from '../lib/utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { ProfileAvatar } from './ProfileAvatar';
import { HodlVideo } from './HodlVideo';
import { Likes } from './Likes';
import { HodlImage2 } from './HodlImage2';

const NftList = ({ 
    nfts, 
    viewSale=false, 
    showTop=true, 
    showBottom=true, 
    showAvatar=true, 
    showName=true, 
    gridColumns=null, 
    imgHeight=null, 
    onClick=null, 
    highlightNft=null 
}) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

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
                gridGap: 12,
                [`& .${imageListItemClasses.root}`]: {
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {nfts.filter(nft => nft).map((nft, i) => (
                <ImageListItem key={i} onClick={() => {
                    if (onClick) {
                        onClick(nft.tokenId)
                    } 
                    }}>
                    <Box sx={{ 
                        display: 'flex',
                        position: 'relative',
                        padding: 0,
                        borderRadius: 2,
                        img: {
                            border: highlightNft ? '2px solid': 'none',
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
                        {assetType(nft) === 'gif' && <HodlVideo sx={{ video: { width: '100%' } }} cid={nft?.image} transformations={nft?.filter} gif={true} />}
                        {assetType(nft) === 'video' && <HodlVideo cid={nft?.image} controls={false} onlyPoster={true} transformations='l_text:Arial_100_bold:VIDEO,co_rgb:FFFFFF' />}
                        {assetType(nft) === 'image' &&
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
                                    src={`${createCloudinaryUrl('image', 'upload', `c_limit,f_auto,q_20,h_350${nft?.filter ? ',' + nft?.filter : ''}`, 'nfts', nft.image)}`}
                                />
                                {matches ?
                                    <HodlImage2
                                        image={nft?.image}
                                        effect={nft?.filter}
                                        imgSizes={"(max-width:599px) 100vw, (max-width:899px) 50vw, (max-width:1199px) 33vw, 25vw"}
                                    /> :
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
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            '.MuiImageListItemBar-titleWrap, .MuiImageListItemBar-actionIcon': {
                                padding: 1,
                            }
                        }}

                        position="top"
                        title={
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: "center",
                            }}>
                                {showAvatar && <ProfileAvatar size="small" profileAddress={nft.seller} color="greyscale" />}
                                {showName && <Typography sx={{ padding: 1 }}>{truncateText(nft.name, 20)}</Typography>}
                                {Boolean(nft?.price) &&
                                    <Typography sx={{ padding: 1 }}>{`${nft.price} Matic`}</Typography>
                                }
                            </Box>
                        }
                    />
                    <ImageListItemBar
                        sx={{
                            display: () => showBottom ? 'flex' : 'none',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4,
                            '.MuiImageListItemBar-titleWrap, .MuiImageListItemBar-actionIcon': {
                                padding: 1,
                            }
                        }}
                        subtitle={
                            <Stack>
                                <Likes tokenId={nft?.tokenId} />
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
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        paddingY: 0.5,
                                        margin: 0,
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
