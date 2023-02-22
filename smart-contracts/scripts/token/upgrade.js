const { ethers, upgrades } = require("hardhat");
const dotenv = require('dotenv');
dotenv.config({ path: '.env.deployment.local' })


// address biconomyForwarder = 0x69015912AA33720b842dCD6aC059Ed623F28d9f7;
// address biconomyForwarderMainnet = 0xf0511f123164602042ab2bCF02111fA5D3Fe97CD;
async function main() {
  const FEE_DATA = {
    maxFeePerGas: ethers.utils.parseUnits('200', 'gwei'),
    maxPriorityFeePerGas: ethers.utils.parseUnits('40', 'gwei'),
  };

  // Wrap the provider so we can override fee data.
  const provider = new ethers.providers.FallbackProvider([ethers.provider], 1);
  provider.getFeeData = async () => FEE_DATA;

  // Create the signer for the private key, connected to the provider with hardcoded fee data
  const signer = (new ethers.Wallet(process.env.WALLET_PRIVATE_KEY)).connect(provider);

  const MyContractV2Factory = await ethers.getContractFactory("HodlNFT", signer);

  const updatedProxy = await upgrades.upgradeProxy(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, MyContractV2Factory, { 
    call: { fn: "initializeV3", args: ["0xf0511f123164602042ab2bCF02111fA5D3Fe97CD"] },
  });
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
