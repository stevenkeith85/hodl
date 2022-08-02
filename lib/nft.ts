// These functions will be called client side as they need the user to sign the transaction with a signer (MetaMask)

import { ethers } from 'ethers'

import { nftmarketaddress, nftaddress } from '../config.js'
import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'

import { getMetaMaskSigner } from "./connections";
import { ActionTypes } from '../models/HodlAction';
import axios from 'axios'
import { Nft } from '../models/Nft.js';

export const listNftOnMarket = async (tokenId, tokenPrice) => {
  const signer = await getMetaMaskSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(tokenPrice, 'ether');

  const tx = await contract.listToken(nftaddress, tokenId, price);
  await tx.wait();

  try {
    const r = await axios.post(
      '/api/actions/add',
      { 
        action: ActionTypes.Listed, 
        object: "token",
        id: Number(tokenId) 
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (e) {
    console.log(e)
  }
}

export const buyNft = async (nft: Nft) => {
  const signer = await getMetaMaskSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  console.log("nft.price", nft.price)
  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

  console.log("price", price)

  const tx = await contract.buyToken(nftaddress, nft.id, { value: price })
  await tx.wait();

  try {
    const r = await axios.post(
      '/api/actions/add',
      { 
        action: ActionTypes.Bought, 
        object: "token",
        id: nft.id
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (e) {
    console.log(e)
  }
}


export const delistNft = async (nft: Nft) => {
  const signer = await getMetaMaskSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const tx = await contract.delistToken(nftaddress, nft.id);
  await tx.wait();
}
