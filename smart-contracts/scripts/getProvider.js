const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");

const getProvider = () => {
    // See https://docs.ethers.io/v5/api/providers/
    if (JSON.parse(process.env.LOCAL_BLOCKCHAIN_NODE)) {
        return ethers.getDefaultProvider(process.env.DEFAULT_PROVIDER_NETWORK);
    } else {
        return new ethers.providers.JsonRpcProvider(`${process.env.ALCHEMY_URL}/${process.env.ALCHEMY_AUTHENTICATION_TOKEN}`);
    }
}

exports.getProvider = getProvider;