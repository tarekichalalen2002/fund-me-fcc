const {getNamedAccounts, ethers} = require("hardhat");

const main = async () =>{
    const sendValue = ethers.utils.parseEther("0.1");
    const deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture("all");
    const fundMe = await ethers.getContract("FundMe" , deployer);
    console.log("Funding contract . . .");
    const fundingResponse = await fundMe.fund({value:sendValue});
    await fundingResponse.wait(1);
    console.log("Funded !");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })