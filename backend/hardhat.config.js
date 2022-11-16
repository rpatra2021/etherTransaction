//https://eth-goerli.g.alchemy.com/v2/YyQx0C602VSncoRQhpzh0YZY2Htx_KsW
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.ACCOUNT_SECRET_KEY]
    }
  }
}