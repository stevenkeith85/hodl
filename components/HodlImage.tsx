import { Box, Skeleton, useTheme } from "@mui/material";
import Head from "next/head";


interface HodlImageProps {
    
    cid: string;
    folder?: "uploads" | "nfts";
    
    format?: "f_auto";
    quality?: "q_auto" | "q_auto:best" | "q_auto:good" | "q_auto:eco" | "q_auto:low";
    cropResize?: "c_lfill" | "c_limit";
    gravity?: "g_auto" | "g_face:center";
    width?: number;
    height?: number;
    effect?: "e_improve" | "e_art:athena" | "e_art:aurora" | "e_art:hairspray" | "e_grayscale";
    environment?: "dev" | "staging" | "prod";

    // html image props
    loading?: "lazy" | "eager";
    decoding?: "auto";
    
    objectFit?: 'cover' | 'scale-down';
    paddingBottom?: "125%" | string; // adjust to change aspect ratio

    // sizes?: string; // helps the browser select an image from the src set
}

export const HodlImage = ({
    format = "f_auto",
    folder = "nfts",
    quality = "q_auto",
    cropResize = "c_lfill",
    gravity = "g_auto",
    width = 575,
    height = 575,
    effect = null,
    environment = "dev",

    loading = "eager",
    decoding = "auto",

    objectFit='cover',
    paddingBottom='125%',

    cid,
    // sizes = "575w",
}: HodlImageProps) => {

    const makeCloudinaryUrl = (width, height) => {
        const baseUrl = `https://res.cloudinary.com/dyobirj7r/image/upload`;

        let cloudinaryUrl = `${baseUrl}/${format},${quality},${cropResize},${gravity},w_${width},h_${height}`;
        if (effect) {
            cloudinaryUrl = `${cloudinaryUrl},${effect}`;
        }

        return `${cloudinaryUrl}/${environment}/${folder}/${cid}`
    }

    // Just get the image at various dimensions for retina screen stuff
    const sources: string = [
        `${makeCloudinaryUrl(width, height)} ${width}w`, 
        `${makeCloudinaryUrl(width*2, height*2)} ${width*2}w`
    ].join(',')

    const source: string = makeCloudinaryUrl(width, height);
    
    return (
        <>
            <Head>
                {
                loading === "eager" && <link
                    key={source}
                    rel="preload"
                    as="image"
                    href={source}
                    // @ts-ignore
                    // imageSrcSet={sources}
                    // @ts-ignore
                    // imagesizes={sizes}

                />}
            </Head>
            <Box
                component="div"
                sx={{
                    display: "block",
                    overflow: "hidden",
                    position: "relative",
                    width: `100%`,
                    height: 'auto', 
                    paddingBottom,
                    
                    img: {
                        position: "absolute",
                        left: 0,
                        top: 0,

                        height: "100%",
                        width: "100%",

                        objectFit,
                        objectPosition: 'top'
                    },
                }}>
                <img
                    alt=""

                    decoding={decoding}
                    loading={loading}

                    src={source}
                    srcSet={sources}
                    sizes={`${width}w`}
                />
                {/* <div style={{
                    bottom: 0,
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                }}>
                </div> */}
            </Box>

        </>
    )
}