import { Card, CardContent, Typography, Stack, Tooltip, Button } from "@mui/material";
import { token, nonCommercial, commercial } from "../../lib/copyright";

export const HodlerPrivilege = ({ nft }) => {
    if (!nft.privilege) {
        return null;
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" sx={{ marginBottom: 2 }}>Hodler Privilege</Typography>
                <Stack spacing={2} direction="row">
                    <Tooltip title={token}>
                        <Button
                            color={nft.privilege === token ? 'secondary' : 'primary'}
                        >Token</Button>
                    </Tooltip>
                    <Tooltip title={nonCommercial}>
                        <Button
                            color={nft.privilege === nonCommercial ? 'secondary' : 'primary'}
                        >Non Commercial</Button>
                    </Tooltip>
                    <Tooltip title={commercial}>
                        <Button
                            color={nft.privilege === commercial ? 'secondary' : 'primary'}
                        >Commercial</Button>
                    </Tooltip>
                </Stack>
            </CardContent>
        </Card>
    )
}