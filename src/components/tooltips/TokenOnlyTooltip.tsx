import { Box, Typography } from "@mui/material";
import Link from "next/link";

export const NoLicenseText = () => (<>
  <Typography mb={1}>
      The current hodler will:
    </Typography>
    <Typography component="ul" sx={{ paddingY: 1, paddingX: 2, margin: 1 }}>
      <Typography component="li" mb={2}>own the token</Typography>
      <Typography component="li">have no <Link href="/asset-license">license</Link> agreement with the token author for the attached asset</Typography>
    </Typography>
    </>)

export const NoLicenseTooltip = () => (
  <Box padding={2}>
    <NoLicenseText />    
  </Box>
)
