// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ReadPrivate {
    address payable public owner;
    uint public variable;
    uint private incremented;

    constructor(uint _variable) {
        owner = payable(msg.sender);
        variable = _variable;
        incremented = _variable + 1;
    }

    function getVariable() view public returns (uint) {
        return variable;
    }

    function getIncremented() view public returns (uint) {
        return incremented;
    }

}
