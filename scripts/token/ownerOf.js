const { ethers } = require("hardhat");
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' })

const HodlNFTProxy = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlNFTProxy;
const HodlMarketProxy = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlMarketProxy;
const HodlNFTABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlNFT.sol/HodlNFT.json'));

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);
  const hodlNFTAsOwner = new ethers.Contract(HodlNFTProxy, HodlNFTABI.abi, ownerAccount);

  const owner = await hodlNFTAsOwner.ownerOf(10);
  

  console.log(await hodlNFTAsOwner.isApprovedForAll(owner, HodlMarketProxy));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
