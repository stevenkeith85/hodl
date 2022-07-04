import { Card, CardContent, Typography, Stack, Tooltip, Button, Chip, Box } from "@mui/material";
import { token, nonCommercial, commercial } from "../../lib/copyright";

export const HodlerPrivilege = ({ nft }) => {
    if (!nft.privilege) {
        return null;
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Box display="flex" justifyContent="space-between"><Typography variant="h3" sx={{ marginBottom: 2 }}>Usage</Typography>
                    {/* Not sure if we want this. Leaving commented out for now */}
                    {/* {nft.privilege === token &&
                            <Chip
                                label="Token Only"
                                color={nft.privilege === token ? "success" : "default"}
                                variant="outlined"
                            />
                        }
                        {nft.privilege === nonCommercial &&
                            <Chip
                                disabled={nft.privilege !== nonCommercial}
                                label="Non Commercial"
                                color={nft.privilege === nonCommercial ? "success" : "default"}
                                variant="outlined"
                            />
                        }
                        {nft.privilege === commercial &&
                            <Chip
                                disabled={nft.privilege !== commercial}
                                label="Commercial"
                                color={nft.privilege === commercial ? "success" : "default"}
                                variant="outlined"
                            />
                        } */}
                </Box>
                {nft.privilege === token && <Typography>{token}</Typography>}
                {nft.privilege === nonCommercial && <Typography>{nonCommercial}</Typography>}
                {nft.privilege === commercial && <Typography>{commercial}</Typography>}

            </CardContent>
        </Card>
    )
}