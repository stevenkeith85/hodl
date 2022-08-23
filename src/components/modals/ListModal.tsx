import { Box, Button, TextField, Typography } from "@mui/material";
import { listNft } from "../../lib/nft";
import { HodlModal } from "../index";
import { useRouter } from "next/router";
import { enqueueSnackbar } from 'notistack';


export const ListModal = ({ listModalOpen, setListModalOpen, setListedModalOpen, price, setPrice }) => {
    const router = useRouter();

    // Possibly extract a hook (or something) for this
    const smartContractError = e => {
        const re = /reverted with reason string '(.+)'/gi;
        const matches = re.exec(e?.data?.message)

        if (matches) {
            enqueueSnackbar(matches[1], { variant: "error" });
        }
    }

    return (
        <HodlModal
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
                            try {
                                enqueueSnackbar(
                                    'Please approve the transaction in Metamask', 
                                { 
                                    // @ts-ignore
                                    variant: "hodlsnackbar",
                                    type: "info"
                                });

                                await listNft(router.query.tokenId, price);

                                setListModalOpen(false);
                                setListedModalOpen(true);
                            } catch (e) {
                                if (e.code === -32603) {
                                    smartContractError(e);
                                }
                            }
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
        </HodlModal>
    )
}