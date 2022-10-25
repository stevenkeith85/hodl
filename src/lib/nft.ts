// These functions are called client side 
// as they need the user to sign the transaction with a signer (MetaMask)
// TODO: They could be react hooks

import { Contract } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'

import Market from '../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json'

import { getMetaMaskSigner } from "./connections";
import axios from 'axios'
import { MutableToken } from '../models/Nft.js';
import { Token } from '../models/Token';

export const listNft = async (token: Token, price: string) => {
  
  const signer = await getMetaMaskSigner();
  const contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);
  const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, signer);

  // If we aren't approved, then ask for approval.
  // NB: The user will be approved if they've listed a token with us before. If not, then they'll need to pay the additional gas cost to approve us.
  // TODO: We can probably override a method in the contract that means users won't need to do this.
  if (!await tokenContract.isApprovedForAll(await signer.getAddress(), process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS)) {
    const approvalTx = await tokenContract.setApprovalForAll(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, token.id);
    await approvalTx.wait();
  };

  const { hash } = await contract.listToken(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, token.id, parseUnits(price, 'ether'));

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

export const buyNft = async (token: Token, mutableToken: MutableToken) => {
  const signer = await getMetaMaskSigner();
  
  const contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);
  const price = parseUnits(mutableToken.price.toString(), 'ether')
  
  const { hash } = await contract.buyToken(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, token.id, { value: price })

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


export const delistNft = async (token: Token) => {
  const signer = await getMetaMaskSigner();
  const contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);

  const { hash } = await contract.delistToken(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, token.id);

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
