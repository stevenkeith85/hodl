const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

const dotenv = require('dotenv');
dotenv.config({ path: '.env.development.local' }) // change this depending on environment

async function main() {
  const ownerAccount = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, ethers.provider);

  const HodlMarketFactory = await ethers.getContractFactory("HodlMarket", ownerAccount);
  const hodlMarketAsOwner = await upgrades.deployProxy(HodlMarketFactory, [], { initializer: 'initialize' })
  await hodlMarketAsOwner.deployed();

  console.log('Market proxy deployed at  ', hodlMarketAsOwner.address);

  const HodlNFTFactory = await ethers.getContractFactory("HodlNFT", ownerAccount);
  const hodlNFTAsOwner = await upgrades.deployProxy(HodlNFTFactory, [hodlMarketAsOwner.address], { initializer: 'initialize' })
  await hodlNFTAsOwner.deployed();

  console.log('NFT proxy deployed at     ', hodlNFTAsOwner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
