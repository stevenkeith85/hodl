import { Typography, Tooltip, Chip, Box } from "@mui/material";
import { token, nonCommercial, commercial } from "../../lib/copyright";
import { CommercialText } from "../tooltips/CommercialTooltip";
import { HodlerPrivilegeTooltip } from "../tooltips/HodlerPrivilegeTooltip";
import { NonCommercialText } from "../tooltips/NonCommercialTooltip";
import { TokenOnlyText } from "../tooltips/TokenOnlyTooltip";

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
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h2" sx={{ marginBottom: 2 }}>
                    <Tooltip
                        title={<HodlerPrivilegeTooltip />}
                        placement="right-start"
                        arrow>
                        <span>Privilege</span></Tooltip>
                </Typography>
                <Box>
                    {nft.privilege === token && <>
                        <Chip
                            label="Token Only"
                            color={nft.privilege === token ? "success" : "default"}
                            variant="outlined"
                        />
                    </>
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
                    }
                </Box>
            </Box>
            <Box>
                <Box>
                    {nft.privilege === token &&
                        <TokenOnlyText />

                    }
                    {nft.privilege === nonCommercial &&
                        <NonCommercialText />
                    }
                    {nft.privilege === commercial &&
                        <CommercialText />
                    }
                </Box>
            </Box>
        </Box >
    )
}