import Box from "@mui/material/Box";
import dynamic from "next/dynamic";

import React from 'react';

import { HodlCommentsBoxLoading } from "../comments/HodlCommentsBoxLoading";
import { TokenNameAndDescriptionLoading } from "./TokenNameAndDescriptionLoading";


const HodlCommentsBox = dynamic(
  () => import("../../components/comments/HodlCommentsBox").then(mod => mod.HodlCommentsBox),
  {
    ssr: false,
    loading: () => <HodlCommentsBoxLoading />
  }
);


const SocialTab = ({ nft, limit }) => {
  const TokenNameAndDescription = dynamic(
    () => import('./TokenNameAndDescription').then(mod => mod.TokenNameAndDescription),
    {
      ssr: false,
      loading: () => <TokenNameAndDescriptionLoading nft={nft} />
    }
  );

  return (
    <Box
      sx={{
        background: 'white',
        padding: {
          xs: 2,
          sm: 2
        },
        border: `1px solid #ddd`
      }}>
      <TokenNameAndDescription nft={nft} />
      <HodlCommentsBox limit={limit} />
    </Box>
  )
}

export default SocialTab;