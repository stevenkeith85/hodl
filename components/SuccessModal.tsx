import { Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useContext } from "react"
import { 
    HodlButton,
    HodlModal,
    RocketTitle } 
from "./index"

import { WalletContext } from "../pages/_app";

export const SuccessModal = ({modalOpen, setModalOpen, message}) => {
    const { address } = useContext(WalletContext);

    return (
        <HodlModal
        open={modalOpen}
        setOpen={setModalOpen}
      >
          <Stack spacing={4}>
            <RocketTitle title="We have lift off" />
            <Typography sx={{ span: { fontWeight: 600 } }}>
              { message }
            </Typography>
            <Link href={`/profile/${address}`} passHref>
              <HodlButton>
                View Profile
              </HodlButton>
            </Link>
          </Stack>
    </HodlModal>
    )
}