// Our token type matches what is stored in Redis
// At the moment we only store immutable data in Redis
//
// We will likely cache the MUTABLE data at some point thoughh
// to minimise our blockchain calls (cost), speed things up (UX)

export interface Token {
    id: number;
    creator: string;

    name: string;
    description: string;
    image: string; // ipfs://<cid>
    metadata: string; // ipfs://<cid>
    mimeType: string;
    filter: string;
    privilege: string;
    
    // TODO - Mutable data ?
    // owner: string;
    // forSale: boolean;
    // price: string;
  };
