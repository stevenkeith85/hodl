import Typography from "@mui/material/Typography";
import humanize from "humanize-plus";

interface MaticPriceProps {
    price: any,
    color?: "white" | "black",
    size?: number,
    fontSize?: number,
    sx?: object,
    humanizeNumber?: boolean
}

export const MaticPrice: React.FC<MaticPriceProps> = ({
    price,
    color = "white",
    size = 20,
    fontSize = 18,
    sx = {},
    humanizeNumber = false
}) => {

    if (price === null) {
        return;
    }

    return (
        <Typography
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                verticalAlign: 'bottom',
                fontSize,
                gap: 1,
                color,
                'img': {
                    filter: color === 'white' ?
                        'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)' :
                        'brightness(0) saturate(100%) invert(0) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                },
                ...sx
            }}>
            <img src="/matic.svg" width={size} height={size} alt="matic symbol" />
            {
                humanizeNumber ? humanize.formatNumber(price, 2) :
                    price
            }
        </Typography>
    )
}