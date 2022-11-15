//https://eth-goerli.g.alchemy.com/v2/YyQx0C602VSncoRQhpzh0YZY2Htx_KsW

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/YyQx0C602VSncoRQhpzh0YZY2Htx_KsW',
      accounts: ['21178dc31ae9a706d22daa34911b76503f3d094c174b6857f04492c1b42f5d7b']
    }
  }
}