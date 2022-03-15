import fs from 'fs'
import { ethers } from 'ethers'
import mime from 'mime'
import { create } from 'ipfs-http-client'
import { nftmarketaddress, nftaddress } from './config.js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'
import Redis from 'ioredis';
dotenv.config({ path: '../.env' })

const Market = JSON.parse(readFileSync('../artifacts/contracts/NFTMarket.sol/NFTMarket.json'));
const NFT = JSON.parse(readFileSync('../artifacts/contracts/NFT.sol/NFT.json'));

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64'),
  },
});


// @ts-ignore
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


let client = new Redis(process.env.REDIS_CONNECTION_STRING);


const uploadNFT = async (name, description, path) => {
  const file = fs.readFileSync(path)

  // @ts-ignore
  const image = await ipfs.add(file, { cidVersion: 1 });

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return { imageCid: image.cid, metadataCid: metadata.cid };
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const wallets = {
  1: process.env.WALLET_PRIVATE_KEY,
  2: process.env.WALLET2_PRIVATE_KEY,
  3: process.env.WALLET3_PRIVATE_KEY,
}


// createNfts from images in dirpath
async function createNFTs(dirpath) {

  const walletId = process.argv[2];
  const walletPrivateKey = wallets[walletId];
  console.log('Using wallet ', walletId);
  // process.exit(0)

  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = new ethers.Wallet(walletPrivateKey, provider);

  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const dir = await fs.promises.opendir(dirpath)
  const metadata = JSON.parse(readFileSync(dirpath + `/metadata${walletId}.json`));
  console.log(metadata);

  for (const token of metadata) {
    const fullPath = `${dirpath}/${token.file}`;
    const mimeType = mime.getType(fullPath);

    if (mimeType.indexOf('image') !== -1) {
      const { imageCid, metadataCid } = await uploadNFT(token.name, token.description, fullPath);
      console.log('imageCid, metadataCid', imageCid, metadataCid);

      const result = await uploadToCloudinary(fullPath, imageCid);
      console.log(result);

      const tokenCreated = await tokenContract.createToken(`ipfs://${metadataCid}`);
      const tx = await tokenCreated.wait();
      const event = tx.events[0];
      const value = event.args[2];
      const tokenId = value.toNumber();

      console.log('created token', tokenId);

      client.set("token:" + tokenId, JSON.stringify({
        tokenId,
        name: token.name,
        description: token.description,
        image: `ipfs://${imageCid.toString()}`,
        phash: result.phash
      }));

      if (token.price) {
        const price = ethers.utils.parseUnits(token.price, 'ether');
        const tx = await marketContract.listToken(nftaddress, tokenId, price);
        await tx.wait();
        console.log("token listed");
      }

      sleep(2000);
    }
  }

  process.exit(0);
}


const uploadToCloudinary = (fullPath, imageCid) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(fullPath, { public_id: 'nfts/' + imageCid.toString(), phash: true }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })
}


async function main() {
  await createNFTs('assets');
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
