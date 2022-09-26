import { Box, Button, Stack, Typography } from "@mui/material"
import { useRouter } from "next/router";
import { HodlModal } from "./HodlModal";


export const SessionExpiredModal = ({ modalOpen, setModalOpen }) => {
  const router = useRouter();
  return (
    <HodlModal
      open={modalOpen}
      setOpen={setModalOpen}
    >
      <Stack spacing={3} textAlign="center">
        <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Session Expired</Typography>
        <Typography sx={{ fontSize: '18px', color: theme => theme.palette.text.secondary }}>
          Sorry, your session has timed out.
        </Typography>
        <Typography sx={{ fontSize: '18px', color: theme => theme.palette.text.secondary }}>
          You will need to log in again with Metamask
        </Typography>
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

              // remove the query param that tells this dialog to display
              router.replace(window.location.pathname, undefined, { shallow: true });
            }}
          >
            Close
          </Button>
        </Box>
      </Stack>
    </HodlModal >
  )
}