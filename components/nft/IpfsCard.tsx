import { Card, CardContent, Typography, Stack, Tooltip } from "@mui/material";
import { HodlExternalLink } from "../HodlExternalLink";

export const IpfsCard = ({ nft }) => (
    <Card variant="outlined">
        <CardContent>
            <Tooltip title="The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices">
                <Typography variant="h3" sx={{ marginBottom: 2, span: { color: theme => theme.palette.secondary.main } }}>
                    IPFS
                </Typography>
            </Tooltip>
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