import { WalletContext } from '../../contexts/WalletContext';
import { useContext } from "react";

// import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
// import { HodlLink } from "../HodlLink";


// import { grey } from "@mui/material/colors";
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';


const Footer = ({ showFooter = true }) => {
    const { address } = useContext(WalletContext);

    if (!showFooter) {
        return null;
    }

    return <h1>{ address }</h1>
    // return (
    //     <Box>
    //         <Box sx={{
    //             backgroundColor: '#efefef',
    //             borderTop: `1px solid #ddd`,
    //             borderBottom: `1px solid #ddd`
    //         }}
    //         >
    //             <Container maxWidth="xl" sx={{
    //                 paddingTop: {
    //                     xs: 4,
    //                 },
    //                 paddingBottom: {
    //                     xs: 4,
    //                 },
    //             }}>
    //                 <Stack
    //                     direction={{ xs: 'column-reverse', md: 'row' }}
    //                     spacing={{
    //                         xs: 4,
    //                         md: 10
    //                     }}
    //                     sx={{
    //                         display: 'flex',
    //                         justifyContent: {
    //                             md: 'space-between'
    //                         },
    //                         alignItems: {
    //                             xs: 'center',
    //                             md: 'start'
    //                         },
    //                         textAlign: {
    //                             xs: 'center',
    //                             md: 'left'
    //                         }
    //                     }}
    //                 >
    //                     <Stack
    //                         direction={{
    //                             xs: 'column-reverse',
    //                             md: 'row'
    //                         }}
    //                         spacing={{
    //                             xs: 4,
    //                             md: 12
    //                         }}
    //                     >
    //                         <Stack spacing={1}>
    //                             <Typography
    //                                 sx={{
    //                                     fontWeight: 600,
    //                                     marginBottom: 0.5,
    //                                 }}>
    //                                 hodl my moon
    //                             </Typography>
    //                             <HodlLink href="/about">about</HodlLink>
    //                             <HodlLink href="/contact">contact</HodlLink>

    //                         </Stack>
    //                         <Stack spacing={1}>
    //                             <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>tokens</Typography>
    //                             <HodlLink href="/explore">explore</HodlLink>
    //                             {address && <HodlLink href="/create">create</HodlLink>}
    //                         </Stack>
    //                     </Stack>
    //                     <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" gap={1}>
    //                         <Typography
    //                             sx={{
    //                                 fontFamily: theme => theme.logo.fontFamily,
    //                                 fontSize: theme => theme.logo.fontSize,
    //                                 color: theme => theme.palette.primary.main
    //                             }}>
    //                             Hodl My Moon
    //                         </Typography>
    //                     </Box>
    //                 </Stack>
    //             </Container>
    //         </Box>
    //         <Box sx={{ backgroundColor: 'white' }}>
    //             <Container
    //                 maxWidth="xl"
    //                 sx={{
    //                     paddingTop: {
    //                         xs: 2
    //                     },
    //                     paddingBottom: {
    //                         xs: 2,
    //                     },
    //                 }}
    //             >
    //                 <Stack
    //                     direction={{
    //                         xs: 'column',
    //                         md: 'row',
    //                     }}
    //                     spacing={{
    //                         xs: 1,
    //                     }}
    //                     sx={{
    //                         display: 'flex',
    //                         justifyContent: {
    //                             xs: 'center',
    //                             md: 'space-between'
    //                         },
    //                         alignItems: {
    //                             xs: 'center',
    //                         },
    //                     }}>
    //                     <Box
    //                         sx={{
    //                             display: 'flex',
    //                             gap: 3
    //                         }}
    //                     >
    //                         <RocketLaunchIcon sx={{ fontSize: 16, color: grey[500] }} />
    //                     </Box>
    //                     <Typography sx={{ color: grey[500], fontSize: '12px' }}>Copyright © 2022 Pony Powered Limited.</Typography>
    //                 </Stack>
    //             </Container>
    //         </Box>
    //     </Box >
    // )
}

export default Footer;

