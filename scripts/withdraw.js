const {getNamedAccounts, deployments, ethers} = require("hardhat");


const main = async () => {
    const deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture("all");
    const fundMe = await ethers.getContract("FundMe" , deployer);
    console.log("We are about to withdraw ...");
    const withdrawResponse = await fundMe.withdraw();
    const withdrawReceipt = await withdrawResponse.wait(1);
    console.log("Withdrew !");
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })