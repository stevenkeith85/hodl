import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { fetchNftsInWallet } from "../../lib/profile";
import { InfiniteScroll } from "../InfiniteScroll";

export const HodlingTab = ({ setNumberHodling }) => {
    const router = useRouter();

    return (
        <Stack spacing={4}>
            <InfiniteScroll
                fetcherFn={async (offset, limit) => {
                    const [data, next, length] = await fetchNftsInWallet(router.query.address, offset, limit);
                    // @ts-ignore
                    setNumberHodling(Number(length));

                    return [data, next, length]
                }}
                swrKey={'walletNfts: ' + router.query.address}
                showTop={false} />
        </Stack>
    )
}