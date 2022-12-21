import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import { getShortAddress } from "../../lib/getShortAddress";
import { cidToGatewayUrl } from "../../lib/utils";


export const TokenDetailsCard = ({ prefetchedToken }) => {
    return (<>
        <Box
            sx={{
                padding: 2,
                border: `1px solid #eee`,
                borderRadius: 1,
                background: 'white'
            }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: 2,
                    rowGap: 2
                }}>
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>Contract Address</Box>
                <Link href={`https://polygonscan.com/address/0xca312c1d297570eb37d940ec3143768ccbdeb974`} target="blank" sx={{ textDecoration: 'none' }}>
                    <Box
                        sx={{
                            fontSize: 14,
                            color: theme => theme.palette.primary.main
                        }}>{getShortAddress('0xca312c1d297570eb37d940ec3143768ccbdeb974')}</Box>
                </Link>
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>Token Id</Box>
                <Link href={cidToGatewayUrl(prefetchedToken?.metadata)} target="blank" sx={{ textDecoration: 'none' }}>
                    <Box
                        sx={{
                            fontSize: 14,
                            color: theme => theme.palette.primary.main
                        }}>{prefetchedToken.id}</Box>
                </Link>
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>Token Standard</Box>
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>ERC-721</Box>
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>Chain</Box>
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>Polygon</Box>
            </Box>
        </Box>
    </>)
}