const { ethers, upgrades } = require("hardhat");

const dotenv = require('dotenv');
dotenv.config({ path: '.env.deployment.local' })

async function main() {
  const FEE_DATA = {
    maxFeePerGas: ethers.utils.parseUnits('300', 'gwei'), // we used 300 to deploy to mainnet
    maxPriorityFeePerGas: ethers.utils.parseUnits('85', 'gwei'), // we used 85 to deploy to mainnet
  };

  // Wrap the provider so we can override fee data.
  const provider = new ethers.providers.FallbackProvider([ethers.provider], 1);
  
  provider.getFeeData = async () => FEE_DATA;

  // For Ganache
  // const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);

  // Create the signer for the private key, connected to the provider with hardcoded fee data
  const signer = (new ethers.Wallet(process.env.WALLET_PRIVATE_KEY)).connect(provider);

  const HodlMarketFactory = await ethers.getContractFactory("HodlMarket", signer);
  const hodlMarketAsOwner = await upgrades.deployProxy(HodlMarketFactory, [], { initializer: 'initialize' })
  await hodlMarketAsOwner.deployed();

  console.log('Market proxy deployed at  ', hodlMarketAsOwner.address);

  const HodlNFTFactory = await ethers.getContractFactory("HodlNFT", signer);
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
