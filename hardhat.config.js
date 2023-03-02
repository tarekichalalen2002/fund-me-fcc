require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage");
require("dotenv").config();


const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.17",
  solidity:{
    compilers:[
      {version:"0.8.17"},
      {version:"0.6.6"}]
  },
  defaultNetwork:"hardhat",
  networks:{
    goerli: {
      url:GOERLI_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:5,
      blockConfirmation:6
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId:31337,
    },
  },
  etherscan:{
    apiKey:ETHERSCAN_API_KEY,
  },
  gasReporter:{
    enabled:true,
    outputFile:"gas-report.txt",
    currency:"USD",
    noColors:true,
    coinmarketcap:COINMARKETCAP_API_KEY,
    token:"ETH"
  },
  namedAccounts:{
    deployer:{
      default:0
    },
    user:{
      default:1
    }
  }
};
