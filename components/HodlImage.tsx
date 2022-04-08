import { Box } from "@mui/material";
import { createCloudinaryUrl } from "../lib/utils";

export const HodlImage = ({image, sx={}, imgSizes=null, folder="nfts", filter=null, ext=null}) => {


    const sizes = [400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1350, 1500, 1700]

    const sources = () => {
        return sizes.map(size => `${createCloudinaryUrl('image', 'upload', `f_auto,c_limit,w_${size},q_auto${filter ? ',' + filter : ''}`, folder, image, ext)} ${size}w`
        ).join(',');
    }
    return (
        <Box sx={{
            img: {
                ...sx,
            }
        }}>
            <img 
            style={{
                width: '100%',
                objectFit: "cover",
                objectPosition: 'center'
            }}
            decoding="async"
            loading="eager"
            src={ `${createCloudinaryUrl('image', 'upload', `f_auto,c_limit,w_744,q_auto${filter ? ',' + filter : ''}`, folder, image, ext)} 750w`}
            sizes={imgSizes || "(max-width:899px) 100vw, (max-width:1549px) 50vw, 744px"}
            srcSet= {sources()}
        />
        </Box>
        
    )
}