import { Box } from "@mui/material";
import Head from 'next/head'
import { createCloudinaryUrl, imageSizes } from "../lib/utils";

// transformations need to be in the same order as defined in upload: (A bit shit, but not our fault)

// 'If the order of the transformation parameters changes. 
// For example, w_300,c_scale is considered a different transformation to c_scale,w_300, 
// even though the delivered media looks the same.' 
//
// https://cloudinary.com/documentation/transformations_on_upload#eager_transformations
//
// We will do <format><quality><width><effect> 
//
// <width> will be calculated to match our imageSizes array
export const HodlImage2 = ({ image, folder="nfts", onLoad=null, effect=null, format="f_auto", quality="q_auto", ext=null, imgSizes=null }) => {
    const sources = () => {
        return imageSizes.map(size => `${createCloudinaryUrl('image', 'upload', `c_limit,${format},${quality},w_${size}${ effect ? ',' + effect : ''}`, folder, image, ext)} ${size}w`
        ).join(',');
    }
    
    const preload = imageSizes.map(size => 
        createCloudinaryUrl('image', 'upload', `${format},${quality},w_${size}${ effect ? ',' + effect : ''}`, folder, image, ext));
    
    return (
        <>
        <Head>
            { preload.map(item => <link key={item} href={item} rel="preload" />) }
        </Head>
        <Box sx={{
            img: {
                width: '100%',
                objectFit: "cover",
                objectPosition: 'center'
            }
        }}>
            <img 
                decoding="async"
                loading="eager"
                src={ `${createCloudinaryUrl('image', 'upload', `c_limit,${format},${quality},w_800${ effect ? ',' + effect : ''}`, folder, image, ext)}` }
                sizes={imgSizes || "(max-width:899px) 100vw, (max-width:1549px) 50vw, 800px"}
                srcSet= {sources()}
                onLoad={onLoad}
        />
        </Box>       
        </>
    )
}