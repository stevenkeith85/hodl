const { ethers } = require("hardhat");
const { getProvider } = require("../../getProvider");
const fs = require('fs');

// const dotenv = require('dotenv');
// dotenv.config({ path: '.env.staging.local' })

const HodlMarketProxy = process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS;
const MarketABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlMarket.sol/HodlMarket.json'));

// BE VERY CAREFUL WITH THIS ONE!
async function main() {
  const newOwner = null; // enter new owner's public address here

  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, getProvider());
  const contract = new ethers.Contract(HodlMarketProxy, MarketABI.abi, wallet);

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
