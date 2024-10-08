import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { HodlModal } from "./HodlModal";


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
        <div>
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
        </div>
      </Stack>
    </HodlModal >
  )
}
