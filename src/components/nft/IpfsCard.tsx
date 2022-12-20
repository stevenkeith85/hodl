import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { cidToGatewayUrl } from "../../lib/utils";
import { Token } from "../../models/Token";

interface IpfsCardProps {
    token: Token;
}

export const IpfsCard: React.FC<IpfsCardProps> = ({ token }) => {
    return (
        <Box
            sx={{
                padding: 2,
                border: `1px solid #eee`,
                borderRadius: 1,
                background: 'white'
            }}>

            <Typography
                component="h1"
                sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    padding: 0,
                    marginBottom: 1
                }}>
                Data
            </Typography>
            <Typography mb={2}>View the decentralized data on the interplanatary file system.</Typography>
            <Stack direction="row" spacing={2}>
                <Link href={cidToGatewayUrl(token?.metadata)} target="blank" sx={{ textDecoration: 'none' }}>
                    Metadata
                </Link>
                <Link href={cidToGatewayUrl(token?.image)} target="blank" sx={{ textDecoration: 'none' }}>
                    Image
                </Link>
                <Link href={cidToGatewayUrl(token?.properties?.asset?.uri)} target="blank" sx={{ textDecoration: 'none' }}>
                    Asset
                </Link>
            </Stack>
        </Box>
    )
}