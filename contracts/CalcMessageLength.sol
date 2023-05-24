// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CalcMessageLength {
    address payable public owner;

    event Action(bytes message, uint256 actionNum);
    event CalldataLength(uint256 actionNum, uint256 calldataLength);

    constructor() {
        owner = payable(msg.sender);
    }

    function doAction(
        bytes memory message,
        uint256 actionNum
    ) external returns (bool success) {
        emit Action(message, actionNum);
        uint256 calldataLen;
        assembly {
            calldataLen := calldatasize()
        }
        emit CalldataLength(actionNum, calldataLen);
        return true;
    }


}
