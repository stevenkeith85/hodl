// These functions should only be called server side with getServerSideProps 
// as they will use Providers (read only access to a blockchain node) that will need our API keys.

import NFT from '../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import Market from '../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'

import { ipfsUriToCloudinaryUrl, ipfsUriToGatewayUrl } from '../utils';
import { getProvider } from './connections'
import { ethers, BigNumber } from 'ethers'
import { nftmarketaddress, nftaddress, host } from '../../config.js'


const isTokenForSale = ({ price, seller, tokenId }) => {
    return price !== ethers.constants.Zero &&
           seller !== ethers.constants.AddressZero &&
           tokenId !== ethers.constants.Zero;
}

export const fetchNFT = async tokenId => {
    const provider = await getProvider();
  
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  
    const marketItem = await marketContract.getListing(tokenId);
    const owner = await tokenContract.ownerOf(tokenId);
    const tokenUri = await tokenContract.tokenURI(tokenId);
  
    const r = await fetch(`${host}/api/token/${tokenId}`);
    const { token } = await r.json();
  
    if (!token) {
      return false;
    }
  
    const price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether');
  
    return {
      name: token.name,
      description: token.description,
      price,
      tokenId: token.tokenId,
      owner: isTokenForSale(marketItem) ? marketItem.seller : owner,
      forSale: isTokenForSale(marketItem),
      image: ipfsUriToCloudinaryUrl(token.image),
      ipfsMetadata: tokenUri,
      ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
      ipfsImage: token.image,
      ipfsImageGateway: ipfsUriToGatewayUrl(token.image),
      mimeType: token.mimeType || ''
    }
  }
  
  export const lookupPriceHistory = async tokenId => {
    const provider = await getProvider();
  
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  
    const tokenFilter = marketContract.filters.TokenBought(null, null, BigNumber.from(tokenId))
  
    const txs = await marketContract.queryFilter(tokenFilter, 0, "latest");
  
    const result = [];
  
     for (let tx of txs) {
      const block = await tx.getBlock();
  
      const r = await Promise.all([
        fetch(`${host}/api/nickname?address=${tx.args.seller}`), 
        fetch(`${host}/api/nickname?address=${tx.args.buyer}`)]
      );
      
      let sellerNickname = null;
      let buyerNickname = null;
      
      if (r[0].status === 200) {
        const { nickname } = await r[0].json();
        sellerNickname = nickname;
      }
  
      if (r[1].status === 200) {
        const { nickname} = await r[1].json();
        buyerNickname = nickname;
      }
  
       result.push({
        sellerNickname,
        sellerAddress: tx.args.seller, 
        buyerNickname,
        buyerAddress: tx.args.buyer, 
        price: ethers.utils.formatEther(tx.args.price),
        timestamp: block.timestamp
      })
    
    }
  
    return result.reverse(); // we want the newest first for the UI 
  }
  