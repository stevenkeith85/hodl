import { ethers } from 'ethers'

import NFT from '../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import { getMetaMaskSigner } from './connections';
import axios from 'axios';

export const mintToken = async (url) => {
  const signer = await getMetaMaskSigner();
  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, signer);

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
    console.log(e);
    throw e;
  }
}
