import { Box, Typography } from "@mui/material";


export const DescriptionTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      A description of your token
    </Typography>
    <Typography sx={{ span: { fontWeight: 600 } }} mb={2}>
      We <span>recommend</span> adding up to six #hashtags to your description.
    </Typography>
    <Typography sx={{ span: { fontWeight: 600 } }}>
      This will help users find your token in search.
    </Typography>

  </Box>
)
