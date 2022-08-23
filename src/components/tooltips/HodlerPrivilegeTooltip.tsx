import { Box, Typography } from "@mui/material";


export const HodlerPrivilegeTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      A declaration of what the hodler of this NFT receives.
    </Typography>
    <Typography sx={{ span: { fontWeight: 600 } }}>
      It can <span>help</span> resolve any future copyright / licensing disputes with trades.
    </Typography>
  </Box>
)
