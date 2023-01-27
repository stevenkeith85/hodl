const { ethers, upgrades } = require("hardhat");
const { getProvider } = require("../getProvider");

const dotenv = require('dotenv');
dotenv.config({ path: '.env.deployment.local' })

const HodlNFTProxy = process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS;

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, getProvider());
  const HodlNFTFactoryNew = await ethers.getContractFactory("HodlNFT", ownerAccount);
  await upgrades.forceImport(HodlNFTProxy, HodlNFTFactoryNew);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
