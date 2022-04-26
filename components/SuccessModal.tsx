import { Button, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useContext } from "react"
import { 
    HodlModal,
    RocketTitle } 
from "./index"

import { WalletContext } from '../contexts/WalletContext';

export const SuccessModal = ({modalOpen, setModalOpen, message, tab=1}) => {
    const { nickname, address } = useContext(WalletContext);

    return (
        <HodlModal
        open={modalOpen}
        setOpen={setModalOpen}
      >
          <Stack spacing={4}>
            <RocketTitle title="Success" />
            <Typography sx={{ span: { fontWeight: 600 } }}>
              { message }
            </Typography>
            <div>
            <Link href={`/profile/${nickname || address}?tab=${tab}`} passHref>
              <Button>
                View Profile
              </Button>
            </Link>
            </div>
            
          </Stack>
    </HodlModal>
    )
}