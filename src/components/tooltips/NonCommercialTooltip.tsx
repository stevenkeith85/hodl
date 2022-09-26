import { Box, Typography } from "@mui/material";
import Link from "next/link";

export const NonCommercialText = () => (<>
  <Typography mb={1}>
      The token hodler:
    </Typography>
    <Typography component="ul" sx={{ paddingY: 1, paddingX: 2, margin: 1 }}>
      <Typography component="li" mb={2}>owns the token</Typography>
      <Typography component="li">has a non-commercial <Link href="/asset-license">license</Link> for the attached asset</Typography>
    </Typography>
    </>)

export const NonCommercialTooltip = () => (
    <Box padding={2}>
      <NonCommercialText />
    </Box>
  )