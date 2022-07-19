import { Card, CardContent, Typography, Stack, Tooltip, Button, Chip, Box } from "@mui/material";
import { token, nonCommercial, commercial } from "../../lib/copyright";
import { CommercialTooltip } from "../tooltips/CommercialTooltip";
import { HodlerPrivilegeTooltip } from "../tooltips/HodlerPrivilegeTooltip";
import { NonCommercialTooltip } from "../tooltips/NonCommercialTooltip";
import { TokenOnlyTooltip } from "../tooltips/TokenOnlyTooltip";

export const HodlerPrivilege = ({ nft }) => {
    if (!nft.privilege) {
        return null;
    }

    return (
        <Box
            sx={{
                padding: 2,
                border: `1px solid #ddd`,
                borderRadius: 1
            }}
        >
            <Typography variant="h2" sx={{ marginBottom: 2 }}>
                <Tooltip
                    title={<HodlerPrivilegeTooltip />}
                    placement="right-start"
                    arrow>
                    <span>Hodler Privilege</span></Tooltip>
            </Typography>
            <Box>
                {nft.privilege === token &&
                    <Tooltip
                        title={<TokenOnlyTooltip />}
                        placement="right-start"
                        arrow>
                        <Chip
                            label="Token Only"
                            color={nft.privilege === token ? "success" : "default"}
                            variant="outlined"
                        />
                    </Tooltip>
                }
                {nft.privilege === nonCommercial &&
                    <Tooltip
                        title={<NonCommercialTooltip />}
                        placement="right-start"
                        arrow>
                        <Chip
                            disabled={nft.privilege !== nonCommercial}
                            label="Non Commercial"
                            color={nft.privilege === nonCommercial ? "success" : "default"}
                            variant="outlined"
                        />
                    </Tooltip>
                }
                {nft.privilege === commercial &&
                    <Tooltip
                        title={<CommercialTooltip />}
                        placement="right-start"
                        arrow>
                        <Chip
                            disabled={nft.privilege !== commercial}
                            label="Commercial"
                            color={nft.privilege === commercial ? "success" : "default"}
                            variant="outlined"
                        />

                    </Tooltip>
                }
            </Box>
        </Box>
    )
}