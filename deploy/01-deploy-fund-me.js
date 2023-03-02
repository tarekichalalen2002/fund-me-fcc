const {hre, network} = require("hardhat");
const {networkConfig , developementChains} = require("../helper-hardhat-config");
const depoloyMocks = require("./00-deploy-mocks");
require("dotenv").config();
const  {verify} = require("../utils/verify");


const deployFunc = async (hre) => {
    const {getNamedAccounts , deployments} = hre;
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;
    // const priceFeedAddress = networkConfig[chainId]["priceFeedAddress"];
    let ethUsdPriceFeedAddress;
    if (developementChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }
    else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["priceFeedAddress"];
    }

    console.log(ethUsdPriceFeedAddress);

    const FundMe = await deploy("FundMe" , {
        from:deployer,
        args:[ethUsdPriceFeedAddress],
        log:true,
        waitConfirmations: network.config.blockConfirmation,
    })

    if (!developementChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
        await verify(FundMe.address, [ethUsdPriceFeedAddress]);
    }
}

module.exports = deployFunc;
module.exports.tags = ["all","fundme"];