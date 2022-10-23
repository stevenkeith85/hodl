const { ethers } = require("hardhat");
const { getProvider } = require("../../getProvider");
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.staging.local' })

const HodlNFTProxy = process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS;
const HodlNFTABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlNFT.sol/HodlNFT.json'));

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, getProvider());
  const hodlNFTAsOwner = new ethers.Contract(HodlNFTProxy, HodlNFTABI.abi, ownerAccount);

  await hodlNFTAsOwner.setMintFee(ethers.utils.parseEther("0"));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });