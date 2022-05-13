// These functions will be called client side as they need the user to sign the transaction with a signer (MetaMask)

import { ethers } from 'ethers'

import { nftmarketaddress, nftaddress } from '../config.js'
import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'

import { getMetaMaskSigner } from "../lib/connections";
import { NftAction } from '../pages/api/notifications/models';
import axios from 'axios'

export const buyNft = async (nft) => {
  const signer = await getMetaMaskSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  
  const tx = await contract.buyToken(nftaddress, nft.tokenId, { value: price })
  await tx.wait();

  try {
  const r = await axios.post(
    '/api/notifications/add',
    { action: NftAction.Bought, token: nft.tokenId },
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      },
    }
  )
  } catch(e) {
    console.log(e)
  }
}

export const listNftOnMarket = async (tokenId, tokenPrice) => {
  const signer = await getMetaMaskSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(tokenPrice, 'ether');

  const tx = await contract.listToken(nftaddress, tokenId, price);
  await tx.wait();

  debugger;
  try {
    const r = await axios.post(
      '/api/notifications/add',
      { action: NftAction.Listed, token: Number(tokenId) },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('jwt')
        },
      }
    )
    } catch(e) {
      console.log(e)
    }
}

export const delistNft = async (nft) => {
  const signer = await getMetaMaskSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const tx = await contract.delistToken(nftaddress, nft.tokenId);
  await tx.wait();
}
