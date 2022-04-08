import { Spa } from "@mui/icons-material"
import { Stack, Typography } from "@mui/material"
import { memo } from "react"

export const MintTitle = () => (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        width: '100%'
      }}>
      <Spa color="secondary" />
      <Typography color="secondary" variant="h1">
        Mint
      </Typography>
    </Stack>
  )
  
  export const MintTitleMemo = memo(MintTitle)
