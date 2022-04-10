import { Stack } from "@mui/material";
import { fetchNFTsListedOnMarket } from "../../lib/profile";
import { InfiniteScroll } from "../InfiniteScroll";

export const ListedTab = ({ setNumberListed, profileAddress }) => {
    
    return (
        <Stack spacing={4} >
        {  
          <InfiniteScroll 
            fetcher={async (offset, limit) => {
              const [items, next, length] = await fetchNFTsListedOnMarket(profileAddress, offset, limit);
              // @ts-ignore
              setNumberListed(Number(length));

              return {items, next: Number(next), length: Number(length)}
            }} 
            swrkey={'marketNfts: ' + profileAddress}
            />
          }
        </Stack>
    )
}