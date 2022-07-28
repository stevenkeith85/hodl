import { Typography, Stack, Tooltip, Link, Box } from "@mui/material";
import { cidToGatewayUrl } from "../../lib/utils";
import { IpfsTooltip } from "../tooltips/IpfsTooltip";

export const IpfsCard = ({ nft }) => {

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
                    <span>IPFS</span></Tooltip>
            </Typography>
            <Stack direction="row" spacing={2}>

                <Link href={cidToGatewayUrl(nft?.metadata)} target="blank" sx={{ textDecoration: 'none' }}>
                    Metadata
                </Link>
                <Link href={cidToGatewayUrl(nft?.image)} target="blank" sx={{ textDecoration: 'none' }}>
                    Asset
                </Link>
            </Stack>
        </Box>
    )
}