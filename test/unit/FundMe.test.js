const { getNamedAccounts,network} = require("hardhat");
const {assert , expect} = require("chai");
const { deployments , ethers } = require("hardhat");
const {developementChains} = require("../../helper-hardhat-config");

!developementChains.includes(network.name) ? describe.skip : 
describe("FundMe" , async () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator; 
    const sendValue = ethers.utils.parseEther("1");   // 1 ETH
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture("all");
        fundMe = await ethers.getContract("FundMe" , deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer);
    })

    describe("constructor" , async () => {
        it("sets the aggregator addresses correctely ", async () => {
            const response = await fundMe.getPriceFeed();
            assert.equal(response ,mockV3Aggregator.address); 
        })
    })

    describe("fund" , async () => {
        it("Fail if you don't send enough ETH" , async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough value"
            )
        })
        it("Updated the ammount fund data structure" , async () => {
            await fundMe.fund({value:sendValue});
            const response = await fundMe.getAmountByFunder(
                deployer
            )
            assert(response.toString() , sendValue);
        })
        it("Updated the funders data strucutre" , async () => {
            await fundMe.fund({value:sendValue});
            const funder = await fundMe.getFunder(0);
            assert(funder.toString() , deployer);
        })
    })

    describe("withdraw" , async () => {
        beforeEach(async () => {
            await fundMe.fund({value:sendValue})
        })
        it("Withdraw ETH from a single founder" , async () => {
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);


            const withdrawResponse = await fundMe.withdraw();
            const withdrawReceipt = await withdrawResponse.wait(1);


            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer); 

            assert.equal(endingFundMeBalance , 0);
            
            assert.equal(endingDeployerBalance.add((withdrawReceipt.gasUsed.mul(withdrawReceipt.effectiveGasPrice))).toString(), startingDeployerBalance.add(startingFundMeBalance).toString());
        })
        it("Allows us to withdraw from multiple funders" , async () => {
            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                const element = accounts[i];
                const fundMeConnectedContract = await fundMe.connect(element);
                await fundMeConnectedContract.fund({value:sendValue}); 
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const withdrawResponse = await fundMe.withdraw();
            const withdrawReceipt = await withdrawResponse.wait(1);

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
            assert.equal(endingFundMeBalance , 0);
            assert.equal(endingDeployerBalance.add((withdrawReceipt.gasUsed.mul(withdrawReceipt.effectiveGasPrice))).toString(), startingDeployerBalance.add(startingFundMeBalance).toString());
            await expect(fundMe.getFunder(0)).to.be.reverted;
            for (let i = 0; i < 6; i++) {
                assert(await fundMe.getAmountByFunder(accounts[i].address), 0);
            }
        })

        it("Only the owner can withdraw" , async () => {
            const otherAccount = await ethers.getSigner(4);
            const fundMeConnectedContract = await fundMe.connect(otherAccount);
            await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
                "Sender is not owner"
            );
        })

        it("cheaperWithdraw testing ..." , async () => {
            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++) {
                const element = accounts[i];
                const fundMeConnectedContract = await fundMe.connect(element);
                await fundMeConnectedContract.fund({value:sendValue}); 
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const withdrawResponse = await fundMe.cheaperWithdraw();
            const withdrawReceipt = await withdrawResponse.wait(1);

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
            assert.equal(endingFundMeBalance , 0);
            assert.equal(endingDeployerBalance.add((withdrawReceipt.gasUsed.mul(withdrawReceipt.effectiveGasPrice))).toString(), startingDeployerBalance.add(startingFundMeBalance).toString());
            await expect(fundMe.getFunder(0)).to.be.reverted;
            for (let i = 0; i < 6; i++) {
                assert(await fundMe.getAmountByFunder(accounts[i].address), 0);
            }
        })


        it("cheaper withdraw from a single funder" , async () => {
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);


            const withdrawResponse = await fundMe.cheaperWithdraw();
            const withdrawReceipt = await withdrawResponse.wait(1);


            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer); 

            assert.equal(endingFundMeBalance , 0);
            
            assert.equal(endingDeployerBalance.add((withdrawReceipt.gasUsed.mul(withdrawReceipt.effectiveGasPrice))).toString(), startingDeployerBalance.add(startingFundMeBalance).toString());
        })

        it("Only the owner can cheaperWithdraw" , async () => {
            const otherAccount = await ethers.getSigner(4);
            const fundMeConnectedContract = await fundMe.connect(otherAccount);
            await expect(fundMeConnectedContract.cheaperWithdraw()).to.be.revertedWith(
                "Sender is not owner"
            );
        })

    })
})