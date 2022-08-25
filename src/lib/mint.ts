import { ethers } from 'ethers'

import { nftaddress } from '../../config.js'

import NFT from '../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import { getMetaMaskSigner } from './connections';
import axios from 'axios';

export const mintToken = async (url) => {
  const signer = await getMetaMaskSigner();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);

  const mintFee = await tokenContract.mintFee();
  const { hash } = await tokenContract.createToken(url, { value: mintFee });

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
  // const receipt = await tx.wait();

  // const event = receipt.events[0];
  // const value = event.args[2];
  // const tokenId = value.toNumber();

  // return tokenId;
}
