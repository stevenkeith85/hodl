import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

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
