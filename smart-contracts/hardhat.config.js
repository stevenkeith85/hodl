require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require('solidity-coverage');
require('hardhat-contract-sizer');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.deployment.local' })

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
    //   url: `${process.env.ALCHEMY_URL}/${process.env.ALCHEMY_AUTHENTICATION_TOKEN}/`,
    //   accounts: [process.env.WALLET_PRIVATE_KEY]
    // },
    // mainnet: {
    //   url: `${process.env.ALCHEMY_URL}/${process.env.ALCHEMY_AUTHENTICATION_TOKEN}/`,
    //   accounts: [process.env.WALLET_PRIVATE_KEY],
    // }
  },
};
