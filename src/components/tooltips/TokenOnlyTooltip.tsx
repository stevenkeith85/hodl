import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";

export const NoLicenseText = () => (<>
  <Typography mb={1} color={theme => theme.palette.text.secondary}>
      The token hodler:
    </Typography>
    <Typography component="ul" sx={{ paddingY: 1, paddingX: 2, margin: 1 }}>
      <Typography component="li" mb={2} color={theme => theme.palette.text.secondary}>owns the token</Typography>
      <Typography component="li" color={theme => theme.palette.text.secondary}>has no <Link href="/asset-license">license</Link> for the attached asset</Typography>
    </Typography>
    </>)

export const NoLicenseTooltip = () => (
  <Box padding={2}>
    <NoLicenseText />    
  </Box>
)
