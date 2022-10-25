import { BigNumber } from '@ethersproject/bignumber'

export interface ListingSolidity {
    tokenId: BigNumber;
    price: BigNumber;
    seller: string;
}

// type given to the FE
export interface ListingVM {
    tokenId: number;
    price: string;
    seller: string;
}