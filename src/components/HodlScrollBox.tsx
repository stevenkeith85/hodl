import { Box, Typography } from '@mui/material';
import { HodlBorderedBox } from './HodlBorderedBox';

export const HodlScrollBox = ({ title, children }) => {
    return (<Box
        sx={{
            width: `100%`
        }}
    >
        <Typography
            variant='h2'
            color="primary"
            sx={{
                fontFamily: theme => theme.logo.fontFamily,
                marginBottom: 2,
                padding: 0
            }}>
            {title}
        </Typography>
        <HodlBorderedBox
            sx={{
                paddingY: 1,
                height: "250px",
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                width: '100%',
            }}
        >
            {children}
        </HodlBorderedBox>
    </Box>)
}
