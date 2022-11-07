import { Box, Link, Typography } from "@mui/material";

export const AssetLicenseTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      How can the hodler use the asset attached to your token? 
    </Typography>
    <Typography mb={2}>
      You must select an option.
    </Typography>
    <Typography mb={2}>
      For full details see <Link color="inherit" target={"_blank"} href="/asset-license">here</Link>
    </Typography>
  </Box>
)
