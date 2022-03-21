import { Box, ImageListItemBar, Typography } from "@mui/material";
import Image from "next/image";

export const DetailPageImage = ({token}) => {

    if (!token?.image) {
        return null;
    }

    const loader = ({src, width, quality}) => {
        return`https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${700},q_${quality}/nfts/${src}`;
    }

    return (
        <>
        <Box sx={{ position: 'relative'}}>
            {Boolean(token?.forSale) && <Box
                sx={{
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    color: 'white',
                    img: {
                        filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                    }
                }}
                >
                    <img 
                        src="/polygon-matic-logo.svg" 
                        width={20} 
                        height={20} 
                        
                    />
                    <Typography sx={{ marginLeft: 1, fontSize: 16, fontWeight: 900 }}>{`${token?.price} MATIC`}</Typography>
            </Box>
            }
                            
            <Image
                loader={loader}
                src={token?.image}
                alt={token?.name}
                quality={75}
                width={600}
                height={600}
                sizes="33vw"
                loading="eager"
                layout="responsive"
                objectFit='cover'
                objectPosition="top"
            />
        </Box>
        
        </>
    )
}