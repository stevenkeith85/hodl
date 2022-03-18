const { ethers, upgrades } = require("hardhat");
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '../.env' })

const HodlNFTProxy = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlNFTProxy;

// This is cool! We won't have to update the address the FE uses except when we deploy the proxy.
// Any upgrades will just update the implementation address (if required/i.e. there are changes)
async function main() {
  const ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);

  const HodlNFTFactoryNew = await ethers.getContractFactory("HodlNFT", ownerAccount);
  
  await upgrades.forceImport(HodlNFTProxy, HodlNFTFactoryNew);

  // const proxyAddressAfter = hodlNFTAsOwnerNew.address;
  // const implAddressAfter = await getImplementationAddress(ethers.provider, hodlNFTAsOwnerNew.address);

  // console.log("PROXY IS NOW: ", proxyAddressAfter); // The same as before

  // // This will change is there are differences to the contract that requires a new implementation to be deployed

  // console.log("IMPL IS NOW: ", implAddressAfter); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
