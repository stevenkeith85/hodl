import { Box, Skeleton, useTheme } from "@mui/material";
import Head from "next/head";

// https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/#using-srcset
export const HodlImageResponsive = ({
    folder = "nfts",
    effect = null,
    aspectRatio=null,
    gravity=null,
    environment = "dev",
    cid,
    widths = [900, 1000, 1100, 1200, 1300, 1400], // You should do some experimentation and pick 6 or so
    sizes, // e.g. sizes="(min-width: 900px) 50vw, (min-width: 1200px) calc(1200px / 2)"
    round=false,
    onLoad=null
}) => {

    const makeCloudinaryUrl = (width) => {

        let cloudinaryUrl = '';
        if (aspectRatio) {
            cloudinaryUrl = `https://res.cloudinary.com/dyobirj7r/image/upload/f_auto,q_auto,c_fill,ar_${aspectRatio},w_${width}`;    
        } else {
            cloudinaryUrl = `https://res.cloudinary.com/dyobirj7r/image/upload/f_auto,q_auto,c_fit,w_${width}`;
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

    return (
        <Box
            sx={{
                width: `100%`,
                height: `100%`,
                lineHeight: 0,
                img: {
                    width: `100%`,
                    height: `100%`,
                    objectFit: 'scale-down',
                    
                }
            }}>
            <img
                onLoad={() => {
                    if (onLoad) {
                        onLoad();
                    }
                }}
                src={makeCloudinaryUrl(widths[0])}
                srcSet={srcSet}
                alt=""
                sizes={sizes}
            />
        </Box>
    )
}