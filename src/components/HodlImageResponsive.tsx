import { Box } from "@mui/material";
import Head from "next/head";
import { useEffect, useRef } from "react";

// https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/#using-srcset
export const HodlImageResponsive = ({
    folder = "nfts",
    effect = null,
    aspectRatio = null,
    gravity = null,
    environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER,
    cid,
    widths = [900, 1000, 1100, 1200, 1300, 1400], // You should do some experimentation and pick 6 or so
    sizes, // e.g. sizes="(min-width: 900px) 50vw, (min-width: 1200px) calc(1200px / 2)"
    round = false,
    onLoad = null,
    objectFit = 'scale-down',
    objectPosition = 'center',
    zoom=null
}) => {

    const makeCloudinaryUrl = (width) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
        let cloudinaryUrl = '';
        if (aspectRatio) {
            cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,c_fill,ar_${aspectRatio},w_${width}`;
        } else {
            cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,c_fit,w_${width}`;
        }

        if (zoom) {
            cloudinaryUrl = `${cloudinaryUrl},${zoom}`;
        }
        if (effect) {
            cloudinaryUrl = `${cloudinaryUrl},${effect}`;
        }

        if (gravity) {
            cloudinaryUrl = `${cloudinaryUrl},${gravity}`;
        }

        if (round) {
            cloudinaryUrl = `${cloudinaryUrl}/r_max`;
        }

        return `${cloudinaryUrl}/${environment}/${folder}/${cid}`
    }

    const srcSet = widths.map(width => `${makeCloudinaryUrl(width)} ${width}w`).join(',');

    const src = makeCloudinaryUrl(widths[0]);

    const imgRef  = useRef(null);
    
    // onload doesn't fire if the image is being loaded from cache. You can use the complete property to check for this case.
    useEffect(() => {
        if(imgRef.current) {
            if (imgRef.current.complete && onLoad) {
                onLoad();
            }
        }
    }, []);

    return (
        <>
            <Head>
                {
                    <link
                        key={cid}
                        rel="preload"
                        as="image"
                        href={src}
                        //@ts-ignore
                        imagesrcset={srcSet}
                        //@ts-ignore
                        imagesizes={sizes}
                    />}
            </Head>
            <Box
                sx={{
                    width: `100%`,
                    height: `100%`,
                    lineHeight: 0,
                    img: {
                        width: `100%`,
                        height: `100%`,
                        objectFit,
                        objectPosition
                    }
                }}>
                <img
                    onLoad={() => {
                        if (onLoad) {
                            onLoad();
                        }
                    }}
                    src={src}
                    srcSet={srcSet}
                    alt=""
                    sizes={sizes}
                    // loading="eager"
                    decoding="auto"
                    ref={imgRef}
                />
            </Box>
        </>
    )
}