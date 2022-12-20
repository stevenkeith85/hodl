import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { token, nonCommercial, commercial } from "../../lib/copyright";

export const AssetLicense = ({ prefetchedToken }) => {
    if (!prefetchedToken?.properties?.asset?.license) {
        return null;
    }

    return (
        <Box
            sx={{
                padding: 2,
                border: `1px solid #eee`,
                borderRadius: 1,
                background: 'white'
            }}
        >
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                columnGap: 2
            }}>
                <Box
                    sx={{
                        fontSize: 14,
                        color: theme => theme.palette.text.secondary
                    }}>

                    Asset License
                </Box>
                <div>
                    {prefetchedToken.properties.asset.license === token &&
                        <Link target="_blank" href="/asset-license">
                            <Chip
                                label="Token Only"
                                color={"secondary"}
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer'
                                }}
                            />
                        </Link>
                    }
                    {prefetchedToken.properties.asset.license === nonCommercial &&
                        <Link target="_blank" href="/asset-license">
                            <Chip
                                label="Non Commercial"
                                color={"secondary"}
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer'
                                }}
                            />
                        </Link>
                    }
                    {prefetchedToken.properties.asset.license === commercial &&
                        <Link target="_blank" href="/asset-license">
                            <Chip
                                label="Commercial"
                                color={"secondary"}
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer'
                                }}
                            />
                        </Link>
                    }
                </div>
            </Box>
        </Box >
    )
}
