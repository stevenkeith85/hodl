import { Box, Typography } from "@mui/material";

export const CommercialTooltip = () => (
  <Box padding={2}>
    <Typography mb={1}>
      The current hodler will:
    </Typography>
    <Typography component="ul" sx={{ paddingY: 1, paddingX: 2, li: {  } }}>
      <Typography component="li" mb={2}>own the token</Typography>
      <Typography component="li">be granted a commercial license for the attached asset</Typography>
    </Typography>
  </Box>
)