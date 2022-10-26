import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { HodlModal } from "./HodlModal";


export const FailureModal = ({ modalOpen, setModalOpen, message }) => {
  const router = useRouter();

  return (
    <HodlModal
      open={modalOpen}
      setOpen={setModalOpen}
    >
      <Stack spacing={3} textAlign="center">
        <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Something has gone wrong</Typography>
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
              router.push(router.asPath);
            }}
          >
            Close
          </Button>
        </Box>
      </Stack>
    </HodlModal >
  )
}
