// Our Token type matches what is stored in Redis
// At the moment we only store immutable data in Redis
//
// We will likely cache the MUTABLE data at some point thoughh
// to minimise our blockchain calls (cost), speed things up (UX)

import { HodlMetadata } from "./Metadata";

export interface Token extends HodlMetadata {
  id: number; // This is the tokenId on the blockchain
  creator: string; // This is the address that minted the token
  metadata: string; // This is the tokenUri (the metadata url)
};

export interface TokenSolidity {
  ownerOf: string; // address
}
