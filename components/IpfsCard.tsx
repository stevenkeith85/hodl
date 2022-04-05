import { Card, CardContent, Typography, Stack } from "@mui/material";
import { HodlExternalLink } from "./HodlExternalLink";

export const IpfsCard = ({nft}) => (
    <Card variant="outlined">
        <CardContent>
        <Typography sx={{ marginBottom: 2, fontWeight: 500 }}>
            InterPlanetary File System
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