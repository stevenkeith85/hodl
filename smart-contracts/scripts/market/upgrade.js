const { ethers, upgrades } = require("hardhat");
const dotenv = require('dotenv');
dotenv.config({ path: '.env.deployment.local' })


// The website will always point to the proxy address.
// An upgrade will change where the proxy points to
async function main() {

  // const FEE_DATA = {
  //   maxFeePerGas: ethers.utils.parseUnits('300', 'gwei'),
  //   maxPriorityFeePerGas: ethers.utils.parseUnits('50', 'gwei'),
  // };

  // // Wrap the provider so we can override fee data.
  // const provider = new ethers.providers.FallbackProvider([ethers.provider], 1);
  // provider.getFeeData = async () => FEE_DATA;

  // For Ganache
  const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);

  // Create the signer for the private key, connected to the provider with hardcoded fee data
  const signer = (new ethers.Wallet(process.env.WALLET_PRIVATE_KEY)).connect(provider);

  const MyContractV2Factory = await ethers.getContractFactory("HodlMarket", signer);

  const updatedProxy = await upgrades.upgradeProxy(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, MyContractV2Factory, { call: "initializeV2" });
  await updatedProxy.deployed();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
