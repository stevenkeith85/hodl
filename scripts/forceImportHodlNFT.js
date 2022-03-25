const { ethers, upgrades } = require("hardhat");
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '../.env' })

const HodlNFTProxy = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlNFTProxy;

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);
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
