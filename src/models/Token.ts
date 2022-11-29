import { HodlMetadata } from "./Metadata";

// This data is immutable
export interface Token extends HodlMetadata {
  id: number; // This is the tokenId on the blockchain
  creator: string; // This is the address that minted the token
  metadata: string; // This is the tokenUri (the metadata url)
}
