import { listNft } from "../../lib/nft";
import { enqueueSnackbar } from 'notistack';
import { MaticSymbol } from "../MaticSymbol";
import { useState } from "react";
import { HodlModal } from "./HodlModal";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";


export const ListModal = ({ 
    listModalOpen, 
    setListModalOpen, 
    setListedModalOpen, 
    price, 
    setPrice,
    token,
 }) => {
    const [listButtonDisabled, setListButtonDisabled] = useState(false);

    // Possibly extract a hook (or something) for this
    const smartContractError = e => {
        enqueueSnackbar(
            e.data?.message || e.data?.details,
            {
                variant: "error",
                hideIconVariant: true
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
                <div>
                    <Button
                        variant="contained"
                        sx={{ paddingY: 1.5, paddingX: 3 }}
                        onClick={async () => {
                            try {
                                setListButtonDisabled(true);
                                enqueueSnackbar(
                                    'Please confirm the transaction in MetaMask',
                                    {
                                        variant: "info",
                                        hideIconVariant: true
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
                </div>
            </Box>
        </HodlModal>
    )
}
