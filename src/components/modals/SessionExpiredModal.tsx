import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
          You will need to log in again with MetaMask
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
              
              // full page refresh
              window.location.href = router.asPath;
            }}
          >
            Close
          </Button>
        </Box>
      </Stack>
    </HodlModal >
  )
}
