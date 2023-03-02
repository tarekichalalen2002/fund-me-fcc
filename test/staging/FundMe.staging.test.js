const { getNamedAccounts, network } = require("hardhat");
const {assert , expect} = require("chai");
const { deployments , ethers } = require("hardhat");
const {developementChains} = require("../../helper-hardhat-config");

developementChains.includes(network.name) ? describe.skip : (
    describe("FundMe" , async () => {
        let deployer;
        let fundMe;
        const sendValue = ethers.utils.parseEther("0.1");
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            fundMe = await ethers.getContract("FundMe" , deployer);
        })
        it("Allows to fund and withdraw" , async () => {
            await fundMe.fund({value: sendValue});
            await fundMe.withdraw();
            const endingBalance = await fundMe.provider.getBalance(fundMe.address);
            assert.equal(endingBalance , 0);
        })
    })
)