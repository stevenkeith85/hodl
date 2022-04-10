const hre = require("hardhat");
const { ethers, upgrades }= require("hardhat");

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' })

async function main() {
  console.log('Deploying with ', process.env.ACCOUNT0_PRIVATE_KEY);
  const ownerAccount = new ethers.Wallet(process.env.ACCOUNT0_PRIVATE_KEY, ethers.provider);

  const HodlMarketFactory = await ethers.getContractFactory("HodlMarket", ownerAccount);
  const hodlMarketAsOwner = await upgrades.deployProxy(HodlMarketFactory, [], { initializer: 'initialize' })
  await hodlMarketAsOwner.deployed();

  console.log('MARKET PROXY DEPLOYED AT  ', hodlMarketAsOwner.address);

  const HodlNFTFactory = await ethers.getContractFactory("HodlNFT", ownerAccount);
  const hodlNFTAsOwner = await upgrades.deployProxy(HodlNFTFactory, [hodlMarketAsOwner.address], { initializer: 'initialize' })
  await hodlNFTAsOwner.deployed();

  console.log('NFT PROXY LINKED TO MARKET', hodlMarketAsOwner.address);
  console.log('NFT PROXY DEPLOYED AT     ', hodlNFTAsOwner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
