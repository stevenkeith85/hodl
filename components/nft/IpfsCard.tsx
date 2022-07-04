import { Card, CardContent, Typography, Stack, Tooltip, Chip } from "@mui/material";
import { useRouter } from "next/router";
import { HodlExternalLink } from "../HodlExternalLink";

export const IpfsCard = ({ nft }) => {

    const router = useRouter();

    return (
        <Card variant="outlined">
            <CardContent>
                <Tooltip title="The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices">
                    <Typography variant="h3" sx={{ marginBottom: 2, span: { color: theme => theme.palette.secondary.main } }}>
                        IPFS
                    </Typography>
                </Tooltip>
                <Stack direction="row" spacing={2}>
                    <Chip color="primary" variant="outlined" label="Metadata" onClick={() => open(nft?.ipfsMetadataGateway || '#')} />
                    <Chip color="secondary" variant="outlined" label="Asset" onClick={() => open(nft?.ipfsImageGateway || '#')} />
                </Stack>
            </CardContent>
        </Card>
    )
}