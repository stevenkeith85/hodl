import { HodlMetadata } from "./Metadata";

// This data does not change once the token is minted.
export interface Token extends HodlMetadata {
  id: number; // This is the tokenId on the blockchain
  creator: string; // This is the address that minted the token
  metadata: string; // This is the tokenUri (the metadata url)
};

export interface TokenSolidity {
  ownerOf: string; // address
}
