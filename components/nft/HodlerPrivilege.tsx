import { Card, CardContent, Typography, Stack, Tooltip, Button, Chip } from "@mui/material";
import { token, nonCommercial, commercial } from "../../lib/copyright";

export const HodlerPrivilege = ({ nft }) => {
    if (!nft.privilege) {
        return null;
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" sx={{ marginBottom: 2 }}>Usage</Typography>
                <Stack spacing={1} direction="row">
                    <Tooltip title={token}>
                        <Chip
                            disabled={nft.privilege !== token}
                            label="Token Only"
                            color={nft.privilege === token ? "success" : "default"}
                            variant="outlined"
                        ></Chip>
                    </Tooltip>
                    <Tooltip title={nonCommercial}>
                        <Chip
                            disabled={nft.privilege !== nonCommercial}
                            label="Non Commercial"
                            color={nft.privilege === nonCommercial ? "success" : "default"}
                            variant="outlined"
                        ></Chip>
                    </Tooltip>
                    <Tooltip title={commercial}>
                        <Chip
                            disabled={nft.privilege !== commercial}
                            label="Commercial"
                            color={nft.privilege === commercial ? "success" : "default"}
                            variant="outlined"
                        ></Chip>
                    </Tooltip>
                </Stack>
            </CardContent>
        </Card>
    )
}