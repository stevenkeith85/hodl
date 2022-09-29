import { Box, Typography } from '@mui/material';
import { HodlBorderedBox } from './HodlBorderedBox';

export const HodlScrollBox = ({ title, height=250, children }) => {
    return (<Box
        sx={{
            width: `100%`
        }}
    >
        {title}
        <HodlBorderedBox
            sx={{
                paddingY: 1,
                height,
                // display: 'flex',
                // flexDirection: 'column',
                overflowY: 'auto',
                // width: '100%',
            }}
        >
            {children}
        </HodlBorderedBox>
    </Box>)
}
