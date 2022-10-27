import {
  Box,
  Skeleton,
  Typography
} from "@mui/material";

import React from 'react';
import { MaticPrice } from "../MaticPrice";
import { NftActionButtons } from "./NftActionButtons";


const MarketTab = ({ mutableToken, nft }) => (
  <Box display="grid" gap={4}>
    <Box
      display="grid"
      sx={{
        background: '#e8eaf6b0',
        padding: 2,
        border: `1px solid #ddd`,
      }}>
      <Typography variant="h2" marginBottom={2}>Price</Typography>
      {
        !mutableToken &&
        <Skeleton variant="text" width={100} height={26} animation="wave" />
      }
      {
        mutableToken && !mutableToken.forSale &&
        <Typography sx={{ fontSize: 16 }}>Not for Sale</Typography>
      }
      {
        mutableToken && mutableToken.forSale &&
        <MaticPrice price={mutableToken?.price} color="black" size={18} fontSize={16} />}
      {mutableToken && <Box
        sx={{
          marginTop: 2
        }}>
        <NftActionButtons
          token={nft}
          mutableToken={mutableToken}
        />
      </Box>}
    </Box>
    {/* TODO */}
    {/* <PriceHistoryGraph nft={nft} /> */}
  </Box>
)

export default MarketTab