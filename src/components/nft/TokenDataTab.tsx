import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import React from 'react';
import { AssetLicense } from "../../components/nft/AssetLicense";
import { HodlerCreatorCard } from "../../components/nft/HodlerCreatorCard";
import { IpfsCard } from "../../components/nft/IpfsCard";
import { cidToGatewayUrl } from "../../lib/utils";
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
      <TokenDetailsCard token={prefetchedToken} />
      <HodlerCreatorCard
        prefetchedToken={prefetchedToken}
        prefetchedMutableToken={prefetchedMutableToken}
      />
      <AssetLicense
        prefetchedToken={prefetchedToken}
      />
    </Box>
  )
}

export default TokenDataTab