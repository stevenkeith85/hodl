import Box from "@mui/material/Box"
import { MaticPrice } from "./MaticPrice"

export const PriceSticker = ({ price }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: `auto`,
                height: `auto`,
                padding: 1.5,
                paddingY: 0.75,
                background: `rgba(0,0,0,0.5)`,
                zIndex: 2
            }}
        >
            <Box
                sx={{
                    textAlign: 'right'
                }}>
                <MaticPrice
                    price={price}
                    fontSize={14}
                    size={14}
                    humanizeNumber={true}
                />
            </Box>
        </Box>
    )
}