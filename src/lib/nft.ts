// These functions are called client side 
// as they need the user to sign the transaction with a signer (MetaMask)
// TODO: They could be react hooks

import { ethers } from 'ethers'

import Market from '../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'

import { getMetaMaskSigner } from "./connections";
import axios from 'axios'
import { Nft } from '../models/Nft.js';

export const listNft = async (tokenId, tokenPrice) => {
  const signer = await getMetaMaskSigner();
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);
  const price = ethers.utils.parseUnits(tokenPrice, 'ether');
  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, signer);

  // If we aren't approved, then ask for approval.
  // NB: The user will be approved if they've listed a token with us before. If not, then they'll need to pay the additional gas cost to approve us.
  // TODO: We can probably override a method in the contract that means users won't need to do this.
  if (!await tokenContract.isApprovedForAll(await signer.getAddress(), process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS)) {
    const approvalTx = await tokenContract.setApprovalForAll(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, tokenId);
    await approvalTx.wait();
  };

  const { hash } = await contract.listToken(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, tokenId, price);

  try {
    const r = await axios.post(
      '/api/market/transaction',
      {
       hash,
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
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

  const { hash } = await contract.buyToken(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, nft.id, { value: price })

  try {
    const r = await axios.post(
      '/api/market/transaction',
      {
       hash,
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
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);

  const { hash } = await contract.delistToken(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, nft.id);

  try {
    const r = await axios.post(
      '/api/market/transaction',
      {
       hash,
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
