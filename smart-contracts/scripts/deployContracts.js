const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

const dotenv = require('dotenv');
dotenv.config({ path: '.env.deployment.local' })

const { getProvider } = require("./getProvider");

const FEE_DATA = {
  maxFeePerGas:         ethers.utils.parseUnits('300', 'gwei'),
  maxPriorityFeePerGas: ethers.utils.parseUnits('85',   'gwei'),
};

async function main() {

  const provider = getProvider();
  provider.getFeeData = async () => FEE_DATA;

  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

  const HodlMarketFactory = await ethers.getContractFactory("HodlMarket", signer);
  const hodlMarketAsOwner = await upgrades.deployProxy(HodlMarketFactory, [], { initializer: 'initialize'})
  await hodlMarketAsOwner.deployed();

  console.log('Market proxy deployed at  ', hodlMarketAsOwner.address);

  const HodlNFTFactory = await ethers.getContractFactory("HodlNFT", signer);
  const hodlNFTAsOwner = await upgrades.deployProxy(HodlNFTFactory, [hodlMarketAsOwner.address], { initializer: 'initialize'})
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
