import Typography from "@mui/material/Typography"


export const MaticSymbol = ({ }) => {
    return (
        <Typography
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                verticalAlign: 'bottom',
                gap: 0.5,
                'img': {
                    filter: 'brightness(0) saturate(100%) invert(0) sepia(0%) saturate(0%) hue-rotate(242deg) brightness(115%) contrast(101%)'
                },
            }}>
            <img src="/matic.svg" width={12} height={12} alt="matic symbol" />
        </Typography>
    )
}
