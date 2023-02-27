const { ethers } = require("hardhat");
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.deployment.local' })

const HodlNFT = JSON.parse(fs.readFileSync('artifacts/contracts/HodlNFT.sol/HodlNFT.json'));

async function main() {
  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, ethers.provider);
  const hodlNFTAsOwner = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, signer);

  await hodlNFTAsOwner.setMaxRoyaltyFee(1500);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
