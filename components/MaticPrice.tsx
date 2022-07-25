import { Box, Typography } from '@mui/material'

interface MaticPriceProps {
    nft: any,
    color?: "white" | "black"
}

export const MaticPrice: React.FC<MaticPriceProps> = ({nft, color="white"}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
                'img': {
                    filter: color === 'white' ? 
                        'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)':
                        'brightness(0) saturate(100%) invert(0) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                }
            }}
        >
            <img src="/matic.svg" width={26} height={26} />
            { console.log(nft)}
            {/* TODO - We are trying to make the NFT data structures as consistent as possible; so we can likely switch this to .forSale before going to prod. i.e. data issue at the moment */}
            {nft?.price > 0 && <Typography sx={{ fontSize: '18px' }}>{nft?.price}</Typography>} 
            {nft?.price == 0 && <Typography sx={{ fontSize: '18px' }}>Not For Sale</Typography>}
        </Box>
    )
}