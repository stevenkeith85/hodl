import Box from "@mui/material/Box";

import React from 'react';
import { TokenProperties } from "./TokenProperties";
import { HodlerCreatorCard } from "../../components/nft/HodlerCreatorCard";
import { TokenDetailsCard } from "./TokenDetailsCard";


const TokenDataTab = ({ prefetchedMutableToken, prefetchedToken }) => {
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
      <TokenDetailsCard 
        prefetchedToken={prefetchedToken} 
      />
      <HodlerCreatorCard
        prefetchedToken={prefetchedToken}
        prefetchedMutableToken={prefetchedMutableToken}
      />
      <TokenProperties
        prefetchedToken={prefetchedToken}
      />
    </Box>
  )
}

export default TokenDataTab