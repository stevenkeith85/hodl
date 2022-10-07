import { Typography, Stack, Tooltip, Link, Box } from "@mui/material";
import { cidToGatewayUrl } from "../../lib/utils";
import { Token } from "../../models/Token";
import { IpfsTooltip } from "../tooltips/IpfsTooltip";

interface IpfsCardProps {
    token: Token;
}

export const IpfsCard : React.FC<IpfsCardProps> = ({ token }) => {
    return (
        <Box
            sx={{
                padding: 2,
                border: `1px solid #ddd`,
                borderRadius: 1
            }}>

            <Typography variant="h2" sx={{ marginBottom: 2 }}>
                <Tooltip
                    title={<IpfsTooltip />}
                    placement="right-start"
                    arrow>
                    <span>Data</span></Tooltip>
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