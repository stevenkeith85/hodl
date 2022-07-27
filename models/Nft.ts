// This is a combination of what's on the blockchain, and what's on Redis
//
// TODO: We are moving towards storing everything in Redis, and syncing with the blockchain. 

// i.e. Redis will cache the blockchain data. This will makes things faster, hopefully simpler, and give more certainty about rate-limits, etc
export interface Nft {
    id: number;
    owner: string;

    name: string;
    description: string;
    image: string;

    mimeType: string;
    filter: string;
    privilege: string | null;

    ipfsMetadata: string;
    ipfsMetadataGateway: string;
    ipfsImage: string;
    ipfsImageGateway: string;

    forSale: boolean;
    price: string;
  };