const {hre, network} = require("hardhat");
const {networkConfig , developementChains , DECIMALS, INITIAL_ANSWER} = require("../helper-hardhat-config");


const depoloyMocks = async (hre) => {
    const {getNamedAccounts , deployments} = hre;
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;
    if (developementChains.includes(network.name)) {
        log("Local network detected ! Deploying mocks");
        log(`This contract is depolyed by ${deployer}`);
        await deploy("MockV3Aggregator",{
            contract:"MockV3Aggregator",
            from:deployer,
            log:true,
            args:[DECIMALS , INITIAL_ANSWER],
        })
        log("Mock deployed");
        log("________________________________________________________________________________________________________")
    }
}


module.exports = depoloyMocks;
module.exports.tags = ["all","mocks"];