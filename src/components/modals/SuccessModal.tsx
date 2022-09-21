import { Box, Button, Stack, Typography } from "@mui/material"
import {
  HodlModal
}
  from "../index"

export const SuccessModal = ({
  modalOpen,
  setModalOpen,
  message }) => {
  return (
    <HodlModal
      open={modalOpen}
      setOpen={setModalOpen}
    >
      <Stack spacing={3} textAlign="center">
        <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Success</Typography>
        <Typography sx={{ fontSize: '18px', color: theme => theme.palette.text.secondary }}>{message}</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{
              paddingY: 1.5,
              paddingX: 3
            }}
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Close
          </Button>
        </Box>
      </Stack>
    </HodlModal >
  )
}