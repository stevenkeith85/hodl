export interface Nft {
    tokenId: number;
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