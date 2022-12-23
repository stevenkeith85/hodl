import { Link } from "@mui/material";
import Box from "@mui/material/Box";

import { token, nonCommercial, commercial } from "../../lib/copyright";
import { extractTraits } from "../../lib/extractTraits";


export const TokenProperties = ({ prefetchedToken }) => {
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
                gap: 2
            }}>
                {
                    extractTraits(prefetchedToken.properties).map(([trait, value]) => <>
                        <Box sx={{ color: "text.secondary" }}>{trait} </Box>
                        <Box sx={{ color: "text.secondary" }}>{value}</Box>
                    </>
                    )
                }
                <Box sx={{ color: "text.secondary" }}>
                    Asset License
                </Box>
                <div>
                    {prefetchedToken.properties.asset.license === token &&
                        <Link target="_blank" href="/asset-license">
                            <Box color="primary.main">no license</Box>
                        </Link>
                    }
                    {prefetchedToken.properties.asset.license === nonCommercial &&
                        <Link target="_blank" href="/asset-license">
                            <Box color="primary.main">non commercial</Box>
                        </Link>
                    }
                    {prefetchedToken.properties.asset.license === commercial &&
                        <Link target="_blank" href="/asset-license">
                            <Box color="primary.main">commercial</Box>
                        </Link>
                    }
                </div>
            </Box>
        </Box >
    )
}
