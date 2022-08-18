import { Box, Typography } from '@mui/material'

interface MaticPriceProps {
    price: any,
    color?: "white" | "black",
    size?: number
}

export const MaticPrice: React.FC<MaticPriceProps> = ({price, color="white", size=14}) => {

    if (price === null) {
        return;
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            sx={{
                'img': {
                    filter: color === 'white' ? 
                        'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)':
                        'brightness(0) saturate(100%) invert(0) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                }
            }}
        >
            <img src="/matic.svg" width={size} height={size} alt="matic symbol" />
            {/* TODO - We are trying to make the NFT data structures as consistent as possible; so we can likely switch this to .forSale before going to prod. i.e. data issue at the moment */}
            {price > 0 && <Typography sx={{ fontSize: `${size}px` }}>{price}</Typography>} 
            {price == 0 && <Typography sx={{ fontSize: `${size}px` }}>Not for sale</Typography>}
        </Box>
    )
}