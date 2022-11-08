const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');
const { getProvider } = require("../getProvider");
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' })

const HodlNFTProxy = process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS;

// This is cool! We won't have to update the address the FE uses except when we deploy the proxy.
// Any upgrades will just update the implementation address (if required/i.e. there are changes)
async function main() {
  const ownerAccount = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, getProvider());

  const HodlNFTFactoryNew = await ethers.getContractFactory("HodlNFT", ownerAccount);

  const hodlNFTAsOwnerNew = await upgrades.upgradeProxy(HodlNFTProxy, HodlNFTFactoryNew);
  await hodlNFTAsOwnerNew.deployed();
  
  const proxyAddressAfter = hodlNFTAsOwnerNew.address;
  const implAddressAfter = await getImplementationAddress(ethers.provider, hodlNFTAsOwnerNew.address);

  console.log("NFT PROXY IS NOW: ", proxyAddressAfter); // The same as before
  console.log("NFT IMPL IS NOW: ", implAddressAfter); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
