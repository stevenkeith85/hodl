import Box from "@mui/material/Box";
import React from 'react';
import useSWR from "swr";
import { NftContext } from "../../contexts/NftContext";
import { fetchWithId } from "../../lib/swrFetchers";
import { HodlCommentsBox } from "../comments/HodlCommentsBox";
import { TokenNameAndDescription } from "./TokenNameAndDescription";


const SocialTab = ({ prefetchedToken, limit, prefetchedPinnedComment = null }) => {

  const { data: comment } = useSWR(
    prefetchedToken?.id ? [`/api/comments/pinned`, prefetchedToken?.id] : null,
    fetchWithId,
    {
      fallbackData: prefetchedPinnedComment
    }
  );

  return (
    <NftContext.Provider
      value={{
        nft: prefetchedToken,
        pinnedComment: comment
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: {
            xs: 2,
            sm: 4
          }
        }}
      >
        <Box
          sx={{
            background: 'white',
            padding: {
              xs: 2,
              sm: 2
            },
            borderRadius: 1,
            border: '1px solid #eee',
          }}>
          <TokenNameAndDescription token={prefetchedToken} />
        </Box>
        <Box
          sx={{
            background: 'white',
            borderRadius: 1,
            border: '1px solid #eee',
          }}>
          <HodlCommentsBox limit={limit} height='450px' />
        </Box>
      </Box>
    </NftContext.Provider>)
}

export default SocialTab;