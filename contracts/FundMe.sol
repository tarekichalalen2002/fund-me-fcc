//SPDX-License-Identifier: Mit

pragma solidity ^0.8.0;

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50;

    //  771961
    //	794795
    address[] private s_funders;
    mapping(address => uint256) private s_funderToAmmount;

    address private immutable i_owner;

    AggregatorV3Interface private s_priceFeed;  

    constructor(address priceFeedAddress){
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }


    function fund() public payable{
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "Didn't send enough value");
        s_funderToAmmount[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner{
        // for loop 
        for(uint256 i=0 ; i < s_funders.length ; i++) {
            address funder = s_funders[i];
            s_funderToAmmount[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for(uint256 i=0 ; i < funders.length ; i++) {
            address funder = funders[i];
            s_funderToAmmount[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    function getOwner() public view returns(address){
        return i_owner;
    }

    function getFunder( uint256 funderIndex ) public view returns(address){
        return s_funders[funderIndex];
    }

    function getAmountByFunder( address funderAddress) public view returns(uint256){
        return s_funderToAmmount[funderAddress];
    }

    function getPriceFeed() public view returns(AggregatorV3Interface){
        return s_priceFeed;
    }

    modifier onlyOwner{
        require(msg.sender == i_owner , "Sender is not owner");
        _;
    }
}