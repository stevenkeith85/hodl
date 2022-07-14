import { Box, Skeleton, useTheme } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { createCloudinaryUrl, imageSizes } from "../lib/utils";


interface HodlImageProps {
    cid: string;
    folder?: string;
    effect?: string;
    format?: string;
    quality?: string;
    ext?: string;
    loading?: "lazy" | "eager";
    fit?: string;
    sx?: object;
    sizes?: string;
    height?: string;
    width?: string;
    srcSetSizes?: number[];
    onLoad?: Function;
}

export const HodlImage = ({
    cid,
    folder = "nfts",
    effect = null,
    format = "f_auto",
    quality = "q_auto",
    ext = null,
    loading = "eager",
    fit = "cover",
    sx = {},
    sizes = "(max-width:599px) 600px, (max-width:899px) 450px, (max-width:1199px) 400px, 300px",
    height = 'auto',
    width = '100%',
    srcSetSizes = imageSizes,
    onLoad = null
}: HodlImageProps) => {
    const theme = useTheme();
    
    const sources = () => srcSetSizes.map(
        size => `${createCloudinaryUrl(
            'image',
            'upload',
            `c_limit,${format},${quality},w_${size}${effect ? ',' + effect : ''}`,
            folder,
            cid,
            ext)} ${size}w`
    ).join(',');

    const url = createCloudinaryUrl(
        'image',
        'upload',
        `c_limit,${format},${quality},w_800${effect ? ',' + effect : ''}`,
        folder,
        cid,
        ext
    )

    const [loaded, setLoaded] = useState(false);

    return (
        <>
            <Head>
                {loading === "eager" && <link
                    onLoad={function loaded() {
                        setLoaded(true);
                        if (onLoad) {
                            onLoad();
                        }
                    }}
                    key={url}
                    rel="preload"
                    as="image"
                    href={url}
                    imageSrcSet={sources()}
                    // @ts-ignore
                    imagesizes={sizes}

                />}
            </Head>
            <Box sx={{
                height,
                maxHeight: `100%`,
                img: {
                    objectFit: fit,
                    objectPosition: "top",
                    borderRadius: 1,
                },
                ...sx
            }}>
                <img
                    onLoad={() => {
                        setLoaded(true);
                        if (onLoad) {
                            onLoad();
                        }
                    }}
                    decoding="async"
                    loading={loading}
                    src={url}
                    srcSet={sources()}
                    sizes={sizes}
                    width={width}
                    height={`100%`}
                />
            </Box>

        </>
    )
}