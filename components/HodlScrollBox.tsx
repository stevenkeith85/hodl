import { Box, Typography } from '@mui/material';
import { HodlBorderedBox } from './HodlBorderedBox';

export const HodlScrollBox = ({ title, children }) => {
    return (
        <HodlBorderedBox>
            <Box
                display={"grid"}
                sx={{
                    gap: 2,
                    
                }}>
                <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily }}>{title}</Typography>
                <Box
                    sx={{
                        maxHeight: '210px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: 1
                    }}>
                    {children}
                </Box>
            </Box >
        </HodlBorderedBox>
    )
}
