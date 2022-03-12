import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button, IconButton } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link';
import { grey } from "@mui/material/colors";

const truncateText = (text, length=10) => {
    if (text.length > length) {
        return text.slice(0, length) + '...';
    }

    return text;
}

const NftList = ({ nfts, viewSale = false, showTop = true }) => {
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
                gridGap: 14,
                marginTop: 2,
                marignBottom: 2,
                [`& .${imageListItemClasses.root}`]: {
                    display: "flex",
                    flexDirection: "column"
                }
            }}
        >
            {nfts.map((nft, i) => (
                  <Link href={viewSale ? `/listing/${nft?.tokenId}` : `/nft/${nft?.tokenId}`}>
                <ImageListItem key={i} >
                    <Box sx={{
                        width: '100%',
                        minHeight: {
                            xs: '500px',
                            sm: '400px',
                            md: '350px',
                        },
                        height: '100%',
                        position: 'relative',
                        background: grey[100],
                    }}>
                        <Image
                            src={nft?.image}
                            alt={nft?.name}
                            layout="fill"
                            objectFit='cover'
                        />
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
                                <Typography sx={{ fontSize: 16, fontWeight: 900 }}>{truncateText(nft?.name)}</Typography>
                                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{truncateText(nft?.description, 20)}</Typography>
                            </Box>
                        }
                        actionIcon={
                            <Link 
                                href={viewSale ? `/listing/${nft?.tokenId}` : `/nft/${nft?.tokenId}`}
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
                </Link>
            )
            )}

        </Box>
    )
}

export default NftList
