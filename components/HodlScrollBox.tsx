import { Box, Typography } from '@mui/material';
import { HodlBorderedBox } from './HodlBorderedBox';

export const HodlScrollBox = ({ title, children }) => {
    return (<>
        <HodlBorderedBox
            sx={{
                width: '100%'
            }}
        >
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
                        textAlign: {xs:'center', md: 'left'},
                        padding: 0.75
                    }}>
                        {title}
                </Typography>
                <Box 
                    height="250px" 
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto', 
                        width: '100%',
                        paddingX: 0.75
                    }}>
                    {children}
                </Box>
            </Box >
        </HodlBorderedBox>
    </>)
}
