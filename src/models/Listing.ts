import { BigNumber } from "ethers";

// Represents the Solidity type 'Listing' (see HodlMarket.sol)
export interface Listing {
    tokenId: BigNumber;
    price: BigNumber;
    seller: string;
}
