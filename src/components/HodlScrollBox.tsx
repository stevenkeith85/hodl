import Box from '@mui/material/Box';
import { HodlBorderedBox } from './HodlBorderedBox';

export const HodlScrollBox = ({ title, height = 250, children }) => {
    return (<Box
        sx={{
            width: `100%`
        }}
    >
        {title}
        <HodlBorderedBox
            sx={{
                padding: 2,
                height,
                
                overflow: 'hidden',
                "&:hover": {
                    overflowY: 'auto',
                }
            }}
        >
            {children}
        </HodlBorderedBox>
    </Box>)
}
