const { ethers } = require("hardhat");
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' })

const MarketProxy = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlMarketProxy;
const MarketABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlMarket.sol/HodlMarket.json'));

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);
  const marketContract = new ethers.Contract(MarketProxy, MarketABI.abi, ownerAccount);

  console.log(await marketContract.owner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
