import fs from 'fs'
import Path from 'path'
import { createSale } from './nft.js'
import { ethers } from 'ethers'
import mime from 'mime'

import dotenv from 'dotenv'
import { storeNFT } from './nftStorageUpload.js'
import { copyFile } from 'fs/promises'
dotenv.config({ path: '../.env' })


// TODO: Switch back to IPFS client (i.e. don't use NFT.Storage)
async function createNFTs(dirpath) {
  const dir = await fs.promises.opendir(dirpath)
  const metadataURLs = [];
  const collectionName = process.argv[2];

  const outputdir = 'public/hashed';
  if (!fs.existsSync(outputdir)) {
    fs.mkdirSync(outputdir, { recursive: true });
  }

  for await (const dirent of dir) {
    const filePath = Path.join(dirpath, dirent.name);
    const mimeType = mime.getType(filePath);
    if (mimeType === 'video/mp4') {
      console.log('video not currently supported')
      process.exit(0);
    }

    const token = await storeNFT(filePath, collectionName, 'TODO');

    console.log('copyFile', filePath, '../public/hashed/' + token.ipnft + '.jpg');
    copyFile(filePath, '../public/hashed/' + token.ipnft + '.jpg');

    metadataURLs.push(token.url)
  }

  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

  for (const metadataURL of metadataURLs) {
    await createSale(metadataURL, '1', { provider, signer })
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
