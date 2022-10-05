// This should be run from the same directory as the hardhat config file

const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' })

const HodlNFTProxy = process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS;
const HodlMarketProxy = process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS;

const abi = JSON.parse(fs.readFileSync('./artifacts/contracts/HodlNFT.sol/HodlNFT.json')).abi;

// TODO: Get this from the env file
const DEFAULT_PROVIDER_NETWORK = 'http://192.168.1.242:8545'

task("tokenOwner", "Prints the owner of a token")
    .addParam("id", "The token id")
    .setAction(async (taskArgs) => {
        const provider = ethers.getDefaultProvider(DEFAULT_PROVIDER_NETWORK);
        const contract = new ethers.Contract(HodlNFTProxy, abi, provider);

        const owner = await contract.ownerOf(taskArgs.id);
        console.log("owner", owner);
    });

task("isApprovedForAll", 
    "Prints whether the current owner has approved the market to transfer tokens minted via the hodl nft contract")
    .addParam("id", "The token id")
    .setAction(async (taskArgs) => {
        const provider = ethers.getDefaultProvider(DEFAULT_PROVIDER_NETWORK);
        const contract = new ethers.Contract(HodlNFTProxy, abi, provider);

        const owner = await contract.ownerOf(taskArgs.id);
        console.log(await contract.isApprovedForAll(owner, HodlMarketProxy));
    });
    