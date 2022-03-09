import { Box, imageListItemClasses, ImageListItem, ImageListItemBar, Typography, Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link';
import { grey } from "@mui/material/colors";


const NftList = ({ nfts, viewSale = false }) => {
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
            {nfts.map((nft, i) => (
                <ImageListItem key={i}>
                    <Box sx={{
                        width: '100%',
                        minHeight: {
                            xs: '500px',
                            sm: '400px',
                            md: '350px',
                        },
                        position: 'relative',
                        background: grey[100]
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
                            backgroundColor: 'rgba(0,0,0,0.1)',
                        }}
                        position="top"
                        title={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <img src="/polygon-matic-logo.svg" width={20} height={20} />
                                {Boolean(nft?.price) &&
                                    <Typography sx={{ marginLeft: 1, fontSize: 14, fontWeight: 900 }}>{`${nft.price} MATIC`}</Typography>
                                }
                            </Box>
                        }
                    />
                    <ImageListItemBar
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.2)',
                        }}
                        subtitle={
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 900 }}>{nft?.name.slice(0, 10)}</Typography>
                                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{nft?.description.slice(0, 10)}</Typography>
                            </Box>
                        }
                        actionIcon={
                            <Link href={viewSale ? `/listing/${nft?.tokenId}` : `/nft/${nft?.tokenId}`}>
                                <Button variant="contained" color='primary' disableElevation size="small" sx={{
                                    margin: 2,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    border: (theme) => `1px solid ${theme.palette.primary.light}`,
                                }}>View</Button>
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
