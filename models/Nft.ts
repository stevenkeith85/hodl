// This is a combination of what's on the blockchain, and what's on Redis
//
// TODO: We are moving towards storing everything in Redis, and syncing with the blockchain. 

import { Token } from "./Token";

// Nft includes the base fields of Token (which come from Redis), and the addional fields that
// depend on the blockchain
// TODO - A better name. Perhaps BlockchainToken, MarketItem, TokenWithMetadata, MutableToken, ExtendedToken
export interface Nft extends Token {
  owner: string;
  forSale: boolean;
  price: string; // price in ether
};