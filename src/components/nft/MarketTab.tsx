import React, { useContext } from 'react';

import dynamic from "next/dynamic";

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useMutableToken } from '../../hooks/useMutableToken';
import { MaticPrice } from "../MaticPrice";


const NftActionButtons = dynamic(
  () => import('../../components/nft/NftActionButtons').then(mod => mod.NftActionButtons),
  {
    ssr: true,
    loading: () => null
  }
);

const MarketTab = ({ prefetchedMutableToken, prefetchedToken }) => {
  const { data: mutableToken } = useMutableToken(prefetchedToken.id, prefetchedMutableToken);

  return (
    <Box display="grid" gap={4}>
      <Box
        display="grid"
        sx={{
          background: 'white',
          border: '1px solid #eee',
          padding: 2,
          borderRadius: 1
        }}>
        <Typography
          component="h1"
          sx={{
            fontSize: 16,
            fontWeight: 500,
            padding: 0,
            marginBottom: 1
          }}>
          Price
        </Typography>
        {
          !mutableToken &&
          <Skeleton variant="text" animation="wave">
            <Box
              sx={{
                fontSize: 16,
                color: theme => theme.palette.text.secondary
              }}>
              Not for Sale</Box>
          </Skeleton>
        }
        {
          mutableToken && !mutableToken.forSale &&
          <Box
            sx={{
              fontSize: 16,
              color: theme => theme.palette.text.secondary
            }}>
            Not for Sale</Box>
        }
        {
          mutableToken && mutableToken.forSale &&
          <MaticPrice price={mutableToken?.price} color="black" size={18} fontSize={16} />
        }
        {
          <NftActionButtons
            token={prefetchedToken}
            mutableToken={mutableToken}
          />
        }
      </Box>
      {/* TODO */}
      {/* <PriceHistoryGraph nft={nft} /> */}
    </Box>
  )
}

export default MarketTab