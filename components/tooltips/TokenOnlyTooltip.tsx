import { Box, Typography } from "@mui/material";


export const TokenOnlyTooltip = () => (
  <Box padding={2}>
    <Typography mb={1}>
      The current hodler will:
    </Typography>
    <Typography component="ul" sx={{ paddingY: 1, paddingX: 2 }}>
      <Typography component="li" mb={2}>only own the token</Typography>
      <Typography component="li">have no rights for the attached asset</Typography>
    </Typography>
  </Box>
)
