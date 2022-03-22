import { Box, ImageListItemBar, Typography } from "@mui/material";
import Head from "next/head";
import memoize from 'memoizee';
import { HodlImage } from "./HodlImage";

export const DetailPageImage = ({token}) => {

    if (!token?.image) {
        return null;
    }


    // This is based on
    // "(max-width:899px) 100vw, (max-width:1549px) 50vw, 744px"
    const calcImageWidthWeNeed = memoize(() => {
        const findFindSizeBigEnough = (width) => {
            const sizes = [400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1350, 1500, 1700];

            for (let i = 0; i < sizes.length; i++ ) {
                if (width > sizes[i]) {
                    continue;
                }
                return sizes[i];
            }
        }
        
        const vw = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio;

        let imageWidth;

        if (vw < 900) {
            imageWidth = vw * devicePixelRatio;
        } else if (vw < 1550) {
            imageWidth = (vw / 2) * devicePixelRatio;
        } else {
            imageWidth = devicePixelRatio * 744;
        }
        return findFindSizeBigEnough(imageWidth);
    });
    
    return (
        <>
        <Head>
            {
                <link rel="preload" href={`https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${calcImageWidthWeNeed()},q_auto/nfts/${token.image}`} />
            }
        </Head>
        <Box sx={{ position: 'relative', img: { borderRadius: 1} }}>
            {Boolean(token?.forSale) && <Box
                sx={{
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    borderRadius: 1,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
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
            <Box sx={{display: "block"}}>
                <HodlImage image={token?.image} sx={{ width: '100%'}} />
            </Box>                           
            
        </Box>
        
        </>
    )
}