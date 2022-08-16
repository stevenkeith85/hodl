import { Box, Typography } from "@mui/material";

export const CommercialText = () => (<>
  <Typography mb={1}>
      The current hodler will:
    </Typography>
    <Typography component="ul" sx={{ paddingY: 1, paddingX: 2, margin: 1 }}>
      <Typography component="li" mb={2}>own the token</Typography>
      <Typography component="li">be granted a commercial license for the attached asset</Typography>
    </Typography>
    </>)

export const CommercialTooltip = () => (
  <Box padding={2}>
    <CommercialText />
  </Box>
)