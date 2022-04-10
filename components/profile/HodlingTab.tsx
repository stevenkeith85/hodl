import { Stack } from "@mui/material";
import { fetchNftsInWallet } from "../../lib/profile";
import { InfiniteScroll } from "../InfiniteScroll";

export const HodlingTab = ({ setNumberHodling, profileAddress }) => {
    return (
        <Stack spacing={4}>
            <InfiniteScroll
                fetcher={async (offset, limit) => {
                    const [items, next, length] = await fetchNftsInWallet(profileAddress, offset, limit);
                    // @ts-ignore
                    setNumberHodling(Number(length));

                    return {items, next: Number(next), length: Number(length)}
                }}
                swrkey={'walletNfts: ' + profileAddress}
                viewSale={false}
                showTop={false} 
                />
        </Stack>
    )
}