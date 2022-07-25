import { Box, Button, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useContext } from "react"
import {
  HodlModal,
  RocketTitle
}
  from "../index"

import { WalletContext } from '../../contexts/WalletContext';
import { useRouter } from "next/router";

export const SuccessModal = ({ modalOpen, setModalOpen, message, tab = 1 }) => {
  const { nickname, address } = useContext(WalletContext);

  const router = useRouter();

  return (
    <HodlModal
      open={modalOpen}
      setOpen={setModalOpen}
    >
      <Stack spacing={3} textAlign="center">
        <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Success</Typography>
        <Typography sx={{ fontSize: '18px', color: '#999' }}>{message}</Typography>
        <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={4}>
          <Link href={`/profile/${nickname || address}?tab=${tab}`} passHref>
            <Button
              variant="contained"
              color="primary"
              sx={{
                paddingY: 1.5,
                paddingX: 3
              }}>
              View Profile
            </Button>
          </Link>
          <Button
            variant="contained"
            color="inherit"
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

{/* <HodlModal
            open={listModalOpen}
            setOpen={setListModalOpen}
        >
            <Box display="grid" gap={3} textAlign="center">
                <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>List your NFT</Typography>
                <Typography sx={{ fontSize: '18px', color: '#999' }}>Enter a price in Matic</Typography>
                <TextField
                    label="Price"
                    placeholder="e.g. 10"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={4}>
                    <Button
                        variant="contained"
                        sx={{ paddingY: 1.5, paddingX: 3 }}
                        onClick={async () => {
                    
                        }}
                        disabled={!price}
                    >
                        List
                    </Button>
                    <Button
                        variant="contained"
                        color="inherit"
                        sx={{
                            paddingY: 1.5,
                            paddingX: 3
                        }}
                        onClick={() => setListModalOpen(false)}
                        >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </HodlModal> */}