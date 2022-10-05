const { ethers } = require("hardhat");
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' })

const HodlNFTProxy = process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS;
const HodlNFTABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlNFT.sol/HodlNFT.json'));

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, ethers.provider);
  const hodlNFTAsOwner = new ethers.Contract(HodlNFTProxy, HodlNFTABI.abi, ownerAccount);

  console.log(await hodlNFTAsOwner.mintFee());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
