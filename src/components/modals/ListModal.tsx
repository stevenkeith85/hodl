import { listNft } from "../../lib/nft";
import { enqueueSnackbar } from 'notistack';
import { MaticSymbol } from "../MaticSymbol";
import { useContext, useState } from "react";
import { HodlModal } from "./HodlModal";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { WalletContext } from "../../contexts/WalletContext";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";



export const ListModal = ({
    listModalOpen,
    setListModalOpen,
    setListedModalOpen,
    price,
    setPrice,
    token,
    doList
}) => {
    const [listButtonDisabled, setListButtonDisabled] = useState(false);
    const { signer } = useContext(WalletContext);

    // Possibly extract a hook (or something) for this
    // const smartContractError = e => {
    //     enqueueSnackbar(
    //         e.data?.message || e.data?.details,
    //         {
    //             variant: "error",
    //             hideIconVariant: true
    //         });
    // }


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
                <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>List your NFT</Typography>
                <FormControl>
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
                <FormHelperText sx={{ textAlign: 'center'}}>Connected to Polygon and have Matic for gas?</FormHelperText>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2}}>
                    <div>
                        <Button
                            variant="contained"
                            sx={{ paddingY: 1.5, paddingX: 3 }}
                            onClick={async () => {
                                setListButtonDisabled(true);
                                await doList();
                                setListButtonDisabled(false);
                            }
                            }
                            disabled={!price || listButtonDisabled}
                        >
                            List
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="outlined"
                            sx={{ paddingY: 1.5, paddingX: 3 }}
                            onClick={async () => {
                                setListButtonDisabled(false);
                                setListModalOpen(false);
                            }
                            }
                        >
                            Close
                        </Button>
                    </div>
                </Box>
            </Box>
        </HodlModal>
    )
}
