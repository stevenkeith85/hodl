import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { fetchNFTsListedOnMarket } from "../../lib/profile";
import { InfiniteScroll } from "../InfiniteScroll";

export const ListedTab = ({ setNumberListed }) => {
    const router = useRouter();

    return (
        <Stack spacing={4} >
        {  
          <InfiniteScroll 
            fetcherFn={async (offset, limit) => {
              const [data, next, length] = await fetchNFTsListedOnMarket(router.query.address, offset, limit);
              // @ts-ignore
              setNumberListed(Number(length));

              return [data, next, length]
            }} 
            swrKey={'marketNfts: ' + router.query.address}
            />
          }
        </Stack>
    )
}