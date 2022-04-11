const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '.env.local' })

const HodlMarketProxy = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlMarketProxy;

// This is cool! We won't have to update the address the FE uses except when we deploy the proxy.
async function main() {
  const ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);

  const HodlMarketFactoryNew = await ethers.getContractFactory("HodlMarket", ownerAccount);
  const hodlMarketAsOwnerNew = await upgrades.upgradeProxy(HodlMarketProxy, HodlMarketFactoryNew);
  await hodlMarketAsOwnerNew.deployed();
  
  const proxyAddressAfter = hodlMarketAsOwnerNew.address;
  const implAddressAfter = await getImplementationAddress(ethers.provider, hodlMarketAsOwnerNew.address);

  console.log("MARKET PROXY IS NOW: ", proxyAddressAfter); // The same as before
  console.log("MARKET IMPL IS NOW: ", implAddressAfter); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
