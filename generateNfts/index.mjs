import fs from 'fs'
import { ethers } from 'ethers'
import mime from 'mime'
import { create } from 'ipfs-http-client'
import { copyFile } from 'fs/promises'
import { nftmarketaddress, nftaddress } from './config.js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const Market = JSON.parse(readFileSync('../artifacts/contracts/NFTMarket.sol/NFTMarket.json'));
const NFT = JSON.parse(readFileSync('../artifacts/contracts/NFT.sol/NFT.json'));


// TODO: Build in flexibility with NFT Names / Descriptions / Prices
// Share code with the website API
// Upload to external storage provider

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

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64'),
  },
});

const uploadNFT = async (name, description, path) => {
  const file = fs.readFileSync(path);
  const fileBuffer = new Buffer(file);

  // TODO:
  // We store it with just the contentId
  // if we store it with a path, i.e. contentId/image[.jpg|.png]
  // then we could read the file extension client side, and negate the extra client-side call to IPFS (to determine mimetype)
  const image = await ipfs.add(fileBuffer, { cidVersion: 1 });

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return {imageCid: image.cid, metadataCid: metadata.cid };
}

const getFileExtension = (filePath) => {
  const mimetype = mime.getType(filePath);
  return mime.getExtension(mimetype);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// createNfts from images in dirpath
async function createNFTs(dirpath) {
  console.log('dirpath', dirpath);
  const dir = await fs.promises.opendir(dirpath)
  
  const metadataURLs = [];
  const collectionName = process.argv[2];
  console.log('collectionName', collectionName);

  const hashedDir = '../public/hashed';
  if (!fs.existsSync(hashedDir)) {
    fs.mkdirSync(hashedDir, { recursive: true });
  }

  for await (const dirent of dir) {    
    const mimeType = mime.getType(`${dirpath}/${dirent.name}`);

    if (mimeType === 'video/mp4') {
      console.log('video not currently supported')
      process.exit(0);
    }

    const { imageCid, metadataCid } = await uploadNFT(collectionName, 'TODO', `${dirpath}/${dirent.name}`);

    // Write API calls have a 10 requests/second limit for the following endpoints
    // Once the site is LIVE we probably want to wait a good amount of time before requests as we'll be sharing the rate limit with users
    await sleep(1000); 

    const ext  = getFileExtension(`${dirpath}/${dirent.name}`);
    copyFile(`${dirpath}/${dirent.name}`, `${hashedDir}/${imageCid}.${ext}`);

    metadataURLs.push(`ipfs://${metadataCid}`);
  }

  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

  for (const metadataURL of metadataURLs) {
    await createSale(metadataURL, '5', { provider, signer })
  }
}

async function main() {
  const collectionName = process.argv[2];
  await createNFTs('../nft-assets/' + collectionName);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
