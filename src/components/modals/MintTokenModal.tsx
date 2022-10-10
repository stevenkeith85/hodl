import { Box, Button, Stack, Typography } from "@mui/material"
import { useRouter } from "next/router";
import {
  HodlModal
}
  from "../index"


export const MintTokenModal = ({
  modalOpen,
  setModalOpen,
  children }) => {
  const router = useRouter();

  return (
    <HodlModal
      open={modalOpen}
      setOpen={setModalOpen}
    >
      <Stack spacing={3} textAlign="center">
        <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Success</Typography>
        { children }
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
              router.push('/');
            }}
          >
            Close
          </Button>
        </Box>
      </Stack>
    </HodlModal >
  )
}