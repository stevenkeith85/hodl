const { ethers } = require("hardhat");
const { getProvider } = require("../../getProvider");
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.staging.local' })

const HodlMarketProxy = process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS;
const MarketABI = JSON.parse(fs.readFileSync('artifacts/contracts/HodlMarket.sol/HodlMarket.json'));

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, getProvider());
  const hodlNFTAsOwner = new ethers.Contract(HodlMarketProxy, MarketABI.abi, ownerAccount);

  console.log(await hodlNFTAsOwner.minListingPriceInMatic());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
