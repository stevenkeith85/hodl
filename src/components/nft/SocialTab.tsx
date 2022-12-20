import Box from "@mui/material/Box";
import React from 'react';
import { NftContext } from "../../contexts/NftContext";
import { HodlCommentsBox } from "../comments/HodlCommentsBox";
import { TokenNameAndDescription } from "./TokenNameAndDescription";


const SocialTab = ({ prefetchedToken, limit }) => {
  return (
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
          padding: {
            xs: 2,
            sm: 2
          },
          borderRadius: 1,
          border: '1px solid #eee',
        }}>
        <NftContext.Provider
          value={{
            nft: prefetchedToken,
          }}
        >
          <HodlCommentsBox limit={limit} />
        </NftContext.Provider>
      </Box>
    </Box>)
}

export default SocialTab;