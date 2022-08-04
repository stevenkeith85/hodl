// This should be run from the same directory as the hardhat config file

const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' })

const marketContractAddress = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlMarketProxy;
const tokenContractAddress = JSON.parse(fs.readFileSync('./scripts/addresses.json')).HodlNFTProxy;

const abi = JSON.parse(fs.readFileSync('./artifacts/contracts/HodlNFT.sol/HodlNFT.json')).abi;

task("tokenOwner", "Prints the owner of a token")
    .addParam("id", "The token id")
    .setAction(async (taskArgs) => {
        const provider = ethers.getDefaultProvider("http://localhost:8545");
        const contract = new ethers.Contract(tokenContractAddress, abi, provider);

        const owner = await contract.ownerOf(taskArgs.id);
        console.log("owner", owner);
    });

task("isApprovedForAll", 
    "Prints whether the current owner has approved the market to transfer tokens minted via the hodl nft contract")
    .addParam("id", "The token id")
    .setAction(async (taskArgs) => {
        const provider = ethers.getDefaultProvider("http://localhost:8545");
        const contract = new ethers.Contract(tokenContractAddress, abi, provider);

        const owner = await contract.ownerOf(taskArgs.id);
        console.log(await contract.isApprovedForAll(owner, marketContractAddress));
    });