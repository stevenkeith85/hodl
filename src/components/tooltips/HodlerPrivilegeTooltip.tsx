import { Box, Link, Typography } from "@mui/material";

export const AssetLicenseTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      How can the hodler use the attached asset? 
    </Typography>
    <Typography mb={2}>
      Select a license option.
    </Typography>
    <Typography mb={2}>
      Details <Link color="inherit" target={"_blank"} href="/asset-license">here</Link>
    </Typography>
    
  </Box>
)
