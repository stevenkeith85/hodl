import { Box, Skeleton } from "@mui/material";
import Head from 'next/head'
import { useState } from "react";
import { createCloudinaryUrl, imageSizes } from "../lib/utils";


export const HodlImage2 = ({ 
    image, 
    folder="nfts", 
    onLoad=null, 
    effect=null, 
    format="f_auto", 
    quality="q_auto", 
    ext=null, 
    imgSizes=null, 
    sx={}, 
    alt=null, 
    fit="cover" 
}) => {

    const sources = () => imageSizes.map(
            size => `${createCloudinaryUrl('image', 'upload', `${format},${quality},w_${size}${effect ? ',' + effect : ''}`, folder, image, ext)} ${size}w`
        ).join(',');

    const lowResSources = () => imageSizes.map(
            size => `${createCloudinaryUrl('image', 'upload', `${format},q_10,w_${size}${effect ? ',' + effect : ''}`, folder, image, ext)} ${size}w`
        ).join(',');
    

    const preload = imageSizes.map(
        size => createCloudinaryUrl('image', 'upload', `${format},${quality},w_${size}${effect ? ',' + effect : ''}`, folder, image, ext)
    );
    const lowResPreload = imageSizes.map(
        size => createCloudinaryUrl('image', 'upload', `${format},q_10,w_${size}${effect ? ',' + effect : ''}`, folder, image, ext)
    );

    return (
        <>
            <Head>
                {lowResPreload.map(item => <link key={item} href={item} rel="preload" />)}
                {preload.map(item => <link key={item} href={item} rel="preload" />)}
            </Head>

            <Box sx={{
                display: 'flex',
                height: `100%`,
                width: `100%`,
                position: "relative",
                '.lowRes': {
                    position: 'absolute',
                    zIndex: -1
                },
                img: {
                    objectFit: fit,
                    objectPosition: "top",
                    borderRadius: 1,
                    width: "100%",
                },
                ...sx
            }}>
                     <img
                     className="lowRes"
                     decoding="async"
                     loading="eager"
                     src={`${createCloudinaryUrl('image', 'upload', `c_limit,${format},q_10,w_800${effect ? ',' + effect : ''}`, folder, image, ext)}`}
                     sizes={imgSizes || "(max-width:899px) 100vw, (max-width:1549px) 50vw, 800px"}
                     srcSet={lowResSources()}
                     alt={alt ? alt : 'NFT'}
                 />
                <img
                    decoding="async"
                    loading="eager"
                    src={`${createCloudinaryUrl('image', 'upload', `c_limit,${format},${quality},w_800${effect ? ',' + effect : ''}`, folder, image, ext)}`}
                    sizes={imgSizes || "(max-width:899px) 100vw, (max-width:1549px) 50vw, 800px"}
                    srcSet={sources()}
                    onLoad={() => {
                        if (onLoad) {
                            onLoad()
                        }

                    }}
                    alt={alt ? alt : 'NFT'}
                />

            </Box>
        </>
    )
}