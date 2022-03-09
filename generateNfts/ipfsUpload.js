// This isn't required anymore, as we are using NFT.storage instead.
// Leaving here incase we need to fall back to using this
import { create } from 'ipfs-http-client'
import fs from 'fs'
import Path from 'path'
import { createSale } from './nft.js'
import { ethers } from 'ethers'

import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })


const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64'),
  },
});

export const uploadToIPFS = async (data) => {
  try {
    const added = await ipfs.add(data, {
      cidVersion: 1,
      hashAlg: 'sha2-256'
    });
    return `ipfs://${added.path}`;
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
}

async function ls(path) {
  const dir = await fs.promises.opendir(path)

  const assetURLs = [];
  const metadataURLs = [];

  const collectionName = process.argv[2];

  for await (const dirent of dir) {
    const fullPath = Path.join(path, dirent.name);
    const file = fs.readFileSync(fullPath);
    const buffer = Buffer(file);

    const url = await uploadToIPFS(buffer);
    assetURLs.push(url);
  }

  for (const [i, url] of assetURLs.entries()) {
    const data = JSON.stringify({ name: `${collectionName} ${i}`, description: `${collectionName} NFT #${i}`, image: url });
    const metadataURL = await uploadToIPFS(data);
    metadataURLs.push(metadataURL);
  }

  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

  for (const metadataURL of metadataURLs) {
    await createSale(metadataURL, '1', { provider, signer })
  }
}


async function main() {
  const collectionName = process.argv[2];
  await ls('../nft-assets/' + collectionName);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
