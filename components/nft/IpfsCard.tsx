import { Card, CardContent, Typography, Stack, Tooltip, Chip, Link, Box } from "@mui/material";
import { useRouter } from "next/router";
import { HodlExternalLink } from "../HodlExternalLink";
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

                <Link href={nft?.ipfsMetadataGateway || '#'} target="blank" sx={{ textDecoration: 'none' }}>
                    Metadata
                </Link>
                <Link href={nft?.ipfsImageGateway || '#'} target="blank" sx={{ textDecoration: 'none' }}>
                    Asset
                </Link>
            </Stack>
        </Box>
    )
}