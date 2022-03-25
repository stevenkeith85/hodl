import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, IconButton } from '@mui/material'
import Link from 'next/link';
import { truncateText } from '../lib/utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { HodlImage } from './HodlImage';

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
                        height: {
                            xs: 500, 
                            sm: 400
                        },
                        img: {
                            height: {
                                xs: 500,
                                sm: 400
                            }
                        }
                        }}

                    >
                            <img 
                                style={{
                                    position: 'absolute',
                                    zIndex: -1,
                                    width: '100%',
                                    objectFit: "cover",
                                }}
                                decoding="async"
                                loading="eager"
                                src={`https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,h_350,q_10/e_grayscale/nfts/${nft?.image}`} 
                            />
                    { matches ?
                        <HodlImage sx={{
                            height: {
                                xs: 500,
                                sm: 400
                            }
                            
                        }} image={nft?.image} imgSizes={"(max-width:599px) 100vw, (max-width:899px) 50vw, (max-width:1199px) 33vw, 25vw"} /> : 
                        <HodlImage sx={{
                            height: {
                                xs: 500,
                                sm: 400
                            }
                        }} image={nft?.image} imgSizes={"100vw"} />
                    }
                    </Box>
                    <ImageListItemBar
                        sx={{
                            display: () => showTop ? 'flex' : 'none',
                            backgroundColor: 'rgba(0,0,0,0.25)',
                        }}
                        position="top"
                        title={
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                img: {
                                    filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                                }
                                }}>
                                <img src="/polygon-matic-logo.svg" width={20} height={20} />
                                {Boolean(nft?.price) &&
                                    <Typography sx={{ marginLeft: 1, fontSize: 16, fontWeight: 900 }}>{`${nft.price} MATIC`}</Typography>
                                }
                            </Box>
                        }
                    />
                    <ImageListItemBar
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.25)',
                        }}
                        subtitle={
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 900 }}>{truncateText(nft?.name, 20)}</Typography>
                                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{truncateText(nft?.description, 20)}</Typography>
                            </Box>
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
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: 16,
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
