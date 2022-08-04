require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require('solidity-coverage')
require('hardhat-contract-sizer');
require('dotenv').config()

require('./tasks/token');

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
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
