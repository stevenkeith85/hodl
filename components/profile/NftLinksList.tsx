import { Typography } from "@mui/material";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { InfiniteScrollTab } from "./InfiniteScrollTab";

interface NftLinksList {
  swr: SWRInfiniteResponse<any, any>;
  limit: number;
}

export const NftLinksList: React.FC<NftLinksList> = ({ swr, limit }) => {

  if (swr?.data && swr?.data[0]?.items?.length === 0) {
    return null;
  }

  return (
    <InfiniteScrollTab swr={swr} limit={limit} showAvatar={false} showName={true} />
  )
}