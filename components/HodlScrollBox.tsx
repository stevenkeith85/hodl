import { Box, Typography } from '@mui/material';
import { HodlBorderedBox } from './HodlBorderedBox';

export const HodlScrollBox = ({ title, children }) => {
    return (<>
        <HodlBorderedBox>
            <Box
                display={"grid"}
                sx={{
                    gap: 2,
                    background: 'white'
                }}>
                <Typography 
                    variant='h2' 
                    sx={{ 
                        fontFamily: theme => theme.logo.fontFamily ,
                        textAlign: {xs:'center', md: 'left'}
                    }}>
                        {title}
                </Typography>
                <Box 
                    height="250px" 
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto', 
                        paddingRight: 2,
                        width: '100%'
                    }}>
                    {children}
                </Box>
            </Box >
        </HodlBorderedBox>
    </>)
}
