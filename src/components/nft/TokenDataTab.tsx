import {
  Box
} from "@mui/material";

import React from 'react';
import { AssetLicense } from "../../components/nft/AssetLicense";
import { HodlerCreatorCard } from "../../components/nft/HodlerCreatorCard";
import { IpfsCard } from "../../components/nft/IpfsCard";

const TokenDataTab = ({ mutableToken, nft }) => (
  <Box
    sx={{
      display: 'grid', gap: {
        xs: 2,
        sm: 4
      }
    }}
  >
    <IpfsCard token={nft} />
    <HodlerCreatorCard creator={nft?.creator} hodler={mutableToken?.hodler} />
    <AssetLicense nft={nft} />
  </Box>
)

export default TokenDataTab