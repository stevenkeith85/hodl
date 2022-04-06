import { Box } from "@mui/material";

export const HodlImage = ({image, sx={}, imgSizes=null, folder="nfts", filter=null}) => {

    // iphone12, samsung galaxy, 
    const sizes = [400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1350, 1500, 1700]

    const sources = () => {
        return sizes.map(size => filter ? 
            `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${size},q_auto,${filter}/${folder}/${image} ${size}w` :
            `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${size},q_auto/${folder}/${image} ${size}w`
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
            src={ filter ? `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_744,q_auto,${filter}/${folder}/${image} 750w` :
                            `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_744,q_auto/${folder}/${image} 750w`
            }
            sizes={imgSizes || "(max-width:899px) 100vw, (max-width:1549px) 50vw, 744px"}
            srcSet= {sources()}
        />
        </Box>
        
    )
}