import { Box, Typography } from "@mui/material";
import Head from "next/head";
import memoize from 'memoizee';
import { HodlImage } from "./HodlImage";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const DetailPageImage = ({token, folder='nfts'}) => {

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
                <link rel="preload" href={`https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${calcImageWidthWeNeed()},q_auto/${folder}/${token.image}`} />
            }
        </Head>
        <Box sx={{ position: 'relative', img: { borderRadius: 1} }}>
            
                <HodlImage image={token?.image} sx={{ width: '100%', maxHeight: '80vh'}} />
                <FavoriteBorderIcon 
                    fontSize="large" 
                    sx={{ position: 'absolute', bottom: 20, right: 10, color: "white" }}
                    onClick={() => {
                        console.log('toggle like');
                    }}    
                />
                {/* <FavoriteIcon fontSize="large" sx={{ position: 'absolute', bottom: 20, right: 10, color: "white" }}/> */}

        </Box>
        
        </>
    )
}