import { ethers } from 'ethers'

import { nftmarketaddress, nftaddress } from './config.js'

import { readFileSync } from 'fs'

import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const Market = JSON.parse(readFileSync('../artifacts/contracts/NFTMarket.sol/NFTMarket.json'));
const NFT = JSON.parse(readFileSync('../artifacts/contracts/NFT.sol/NFT.json'));

// SERVER-SIDE NFT FUNCTIONS

export const getContracts = async (signer) => {
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);

    return [marketContract, tokenContract];
}

export const createSale = async (url, tokenPrice, { signer }) => {
    const [marketContract, tokenContract] = await getContracts(signer);

    const createTokenTransaction = await tokenContract.createToken(url);
    const tx = await createTokenTransaction.wait();
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(tokenPrice, 'ether');

    let listingPrice = await marketContract.getListingPrice();
    listingPrice = listingPrice.toString();

    const createMarketItemTransaction = await marketContract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice });
    await createMarketItemTransaction.wait();
}
