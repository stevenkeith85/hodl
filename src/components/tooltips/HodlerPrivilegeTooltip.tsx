import { Box, Link, Typography } from "@mui/material";

export const HodlerPrivilegeTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      A declaration of what the future hodler of this NFT receives.
    </Typography>
    <Typography sx={{ span: { fontWeight: 600 } }} mb={2}>
      It can <span>help</span> resolve any future copyright / licensing disputes.
    </Typography>
    <Typography mb={2}>
      See <Link color="inherit" target={"_blank"} href="/hodler-privilege">here</Link>
    </Typography>
    
  </Box>
)
