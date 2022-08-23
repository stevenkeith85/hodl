import { Box, Typography } from '@mui/material'

interface MaticPriceProps {
    price: any,
    color?: "white" | "black",
    size?: number,
    fontSize?: number,
    sx?: object
}

export const MaticPrice: React.FC<MaticPriceProps> = ({ 
    price, 
    color = "white", 
    size = 26, 
    fontSize = 26,
    sx={}
 }) => {

    if (price === null) {
        return;
    }

    return (
        <Box
            component="span"
            sx={{
                'img': {
                    filter: color === 'white' ?
                        'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)' :
                        'brightness(0) saturate(100%) invert(0) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                },
                lineHeight: 1
            }}
        >
            <Typography
                component="span"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: `${fontSize}px`,
                    gap: 1,
                    ...sx
                }}>
                <img src="/matic.svg" width={size} height={size} alt="matic symbol" />
                {' '}
                {price}
            </Typography>
        </Box>
    )
}