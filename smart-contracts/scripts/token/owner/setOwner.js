const { ethers } = require("hardhat");
const fs = require('fs');
const { getProvider } = require("../../getProvider");
// const dotenv = require('dotenv');
// dotenv.config({ path: '.env.local' })

const HodlNFTProxy = process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS;
const HodlNFTABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlNFT.sol/HodlNFT.json'));

async function main() {
  const newOwner = null;
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, getProvider());
  const contract = new ethers.Contract(HodlNFTProxy, HodlNFTABI.abi, wallet);

  if (newOwner) {
    await contract.transferOwnership(newOwner)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
