import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import dynamic from "next/dynamic";

import React from 'react';

import { HodlCommentsBoxLoading } from "../comments/HodlCommentsBoxLoading";
import { TokenNameAndDescriptionLoading } from "./TokenNameAndDescriptionLoading";



const TokenNameAndDescription = dynamic(
    () => import('./TokenNameAndDescription').then(mod => mod.TokenNameAndDescription),
    {
      ssr: false,
      loading: () => <TokenNameAndDescriptionLoading />
    }
  );
  
  const HodlCommentsBox = dynamic(
    () => import("../../components/comments/HodlCommentsBox").then(mod => mod.HodlCommentsBox),
    {
      ssr: false,
      loading: () => <HodlCommentsBoxLoading />
    }
  );


const SocialTab = ({ nft, limit }) => (
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

export default SocialTab;