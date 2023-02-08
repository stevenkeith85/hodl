// These functions are called client side 
// as they need the user to sign the transaction with a signer (wallet)
import { Contract } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'

import Market from '../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json'

import axios from 'axios'
import { MutableToken } from "../models/MutableToken"
import { Token } from "../models/Token"


export const mintToken = async (url, royaltyFeeInBasisPoints, signer) => {
  try {
    const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, signer);

    const mintFee = await tokenContract.mintFee();
    const { hash } = await tokenContract.createToken(url, royaltyFeeInBasisPoints, { value: mintFee });

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
    );
  } catch (e) {
    throw e;
  }
}


export const mintTokenGasless = async (
  url, 
  royaltyFeeInBasisPoints, 
  walletAddress, 
  biconomy, 
  onSuccess,
  onError
  ) => {

  const tokenContract = new Contract(
    process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS,
    NFT.abi,
    biconomy.ethersProvider
  );

  const mintFee = await tokenContract.mintFee();
  let { data } = await tokenContract.populateTransaction.createToken(url, royaltyFeeInBasisPoints, { value: mintFee });

  let txParams = {
    data: data,
    to: process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS,
    from: walletAddress,
    signatureType: "EIP712_SIGN",
  };

  const provider = await biconomy.provider;

  // @ts-ignore
  const tx = await provider.send("eth_sendTransaction", [txParams]);

  biconomy.on("txHashGenerated", async data => {
    const r = await axios.post(
      '/api/market/transaction',
      {
        hash: data.hash,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    onSuccess();
  });

  biconomy.on("onError", data => {
    console.log(data);
    onError();
  });
}

export const listNft = async (token: Token, price: string, signer) => {
  try {
    const contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);
    const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, signer);

    // If we aren't approved, then ask for approval.
    // NB: The user will be approved if they've listed a token with us before. If not, then they'll need to pay the additional gas cost to approve us.
    // TODO: We can probably override a method in the contract that means users won't need to do this.
    const address = await signer.getAddress();
    if (!await tokenContract.isApprovedForAll(address, process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS)) {
      const approvalTx = await tokenContract.setApprovalForAll(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, token.id);
      await approvalTx.wait();
    };

    try {
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
        );
      } catch (e) {
        throw new Error("We likely weren't able to queue that transaction. Please contact support.")
      }
    } catch (e) {
      // user cancelled tx or smart contract error
      throw e;
    }
  } catch (e) {
    throw e;
  }
}


export const delistNft = async (token: Token, signer) => {
  try {
    const contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);

    try {
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
        );
      } catch (e) {
        // unable to queue the tx.
        throw new Error("We likely weren't able to queue that transaction. Please contact support.")
      }
    } catch (e) {
      // user cancelled the transaction or smart contract error
      throw e;
    }
  } catch (e) {
    // an application error
    throw e;
  }
}


export const buyNft = async (token: Token, mutableToken: MutableToken, signer) => {
  try {
    const contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, signer);

    try {
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
        );
      } catch (e) {
        // unable to queue the tx.
        throw new Error("We likely weren't able to queue that transaction. Please contact support.")
      }
    } catch (e) {
      // user cancelled the transcaction or smart contract error
      throw e;
    }
  } catch (e) {
    // likely an application error
    throw e;
  }
}
