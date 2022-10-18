import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { listNft } from "../../lib/nft";
import { HodlModal } from "../index";
import { useRouter } from "next/router";
import { enqueueSnackbar } from 'notistack';
import { MaticSymbol } from "../MaticSymbol";
import { useState } from "react";


export const ListModal = ({ 
    listModalOpen, 
    setListModalOpen, 
    setListedModalOpen, 
    price, 
    setPrice,
    token,
 }) => {
    const router = useRouter();

    const [listButtonDisabled, setListButtonDisabled] = useState(false);

    // Possibly extract a hook (or something) for this
    const smartContractError = e => {
        enqueueSnackbar(
            e.data?.message || e.data?.details,
            {
                // @ts-ignore
                variant: "hodlsnackbar",
                type: "error"
            });
    }

    return (
        <HodlModal
            open={listModalOpen}
            setOpen={setListModalOpen}
        >
            <Box
                display="grid"
                gap={4}
                textAlign="center"
            >
                <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>List Your Token</Typography>
                <TextField
                    label="Price (in Matic)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <MaticSymbol />
                        </InputAdornment>,
                    }}
                />
                <Box>
                    <Button
                        variant="contained"
                        sx={{ paddingY: 1.5, paddingX: 3 }}
                        onClick={async () => {
                            try {
                                setListButtonDisabled(true);
                                enqueueSnackbar(
                                    'Please confirm the transaction in MetaMask',
                                    {
                                        // @ts-ignore
                                        variant: "hodlsnackbar",
                                        type: "info"
                                    });

                                await listNft(token, price);

                                setListModalOpen(false);
                                setListedModalOpen(true);
                                setListButtonDisabled(false);
                            } catch (e) {
                                setListButtonDisabled(false);
                                if (e.code === -32603) {
                                    smartContractError(e);
                                }
                            }
                        }}
                        disabled={!price || listButtonDisabled}
                    >
                        List
                    </Button>
                    {/* <Button
                        variant="contained"
                        color="inherit"
                        sx={{
                            paddingY: 1.5,
                            paddingX: 3
                        }}
                        onClick={() => setListModalOpen(false)}
                    >
                        Cancel
                    </Button> */}
                </Box>
            </Box>
        </HodlModal>
    )
}