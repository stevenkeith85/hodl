require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config()

module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    //   // accounts: [process.env.WALLET_PRIVATE_KEY]
    // },
    // mainnet: {
    //   url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    //   // accounts: [process.env.WALLET_PRIVATE_KEY]
    // }
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY
  // }
};
