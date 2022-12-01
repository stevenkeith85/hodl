import { Contract } from '@ethersproject/contracts'

import NFT from '../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import axios from 'axios';


// Mint the token with the metadata url for signer
export const mintToken = async (url, signer) => {
  if (!signer) {
    
    // alert("No signer set. Can't mint");
    return;
  }


  try {
    const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, signer);

    const mintFee = await tokenContract.mintFee();
    const { hash } = await tokenContract.createToken(url, { value: mintFee });

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

    return true;
  } catch (e) {
    // alert(e);
    return false;
  }
}
