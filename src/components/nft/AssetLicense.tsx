import { Typography, Tooltip, Chip, Box } from "@mui/material";
import { token, nonCommercial, commercial } from "../../lib/copyright";
import { CommercialText } from "../tooltips/CommercialTooltip";
import { AssetLicenseTooltip } from "../tooltips/HodlerPrivilegeTooltip";
import { NonCommercialText } from "../tooltips/NonCommercialTooltip";
import { NoLicenseText } from "../tooltips/TokenOnlyTooltip";

export const AssetLicense = ({ nft }) => {
    if (!nft?.properties?.asset?.license) {
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
                        title={<AssetLicenseTooltip />}
                        placement="right-start"
                        arrow>
                        <span>License</span></Tooltip>
                </Typography>
                <Box>
                    {nft.properties.asset.license === token && <>
                        <Chip
                            label="Token Only"
                            color={nft.privilege === token ? "success" : "default"}
                            variant="outlined"
                        />
                    </>
                    }
                    {nft.properties.asset.license === nonCommercial &&
                        <Chip
                            disabled={nft.privilege !== nonCommercial}
                            label="Non Commercial"
                            color={nft.privilege === nonCommercial ? "success" : "default"}
                            variant="outlined"
                        />
                    }
                    {nft.properties.asset.license === commercial &&
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
                    {nft.properties.asset.license === token &&
                        <NoLicenseText />

                    }
                    {nft.properties.asset.license === nonCommercial &&
                        <NonCommercialText />
                    }
                    {nft.properties.asset.license === commercial &&
                        <CommercialText />
                    }
                </Box>
            </Box>
        </Box >
    )
}