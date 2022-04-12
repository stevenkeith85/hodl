import { Card, CardContent, Typography, Stack } from "@mui/material";
import { HodlExternalLink } from "../HodlExternalLink";

export const IpfsCard = ({nft}) => (
    <Card variant="outlined">
        <CardContent>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
            IPFS
        </Typography>
        <Stack direction="row" spacing={2}>
            <HodlExternalLink href={nft?.ipfsMetadataGateway || '#'}>
                Metadata
            </HodlExternalLink>
            <HodlExternalLink href={nft?.ipfsImageGateway || '#'}>
                Asset
            </HodlExternalLink>
        </Stack>
        </CardContent>
    </Card>
)