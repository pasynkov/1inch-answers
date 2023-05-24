// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract IndexedLogs {

    address payable public owner;

    event NonIndexedAction(address payable caller, uint256 actionNum);
    event IndexedAction(address payable indexed caller, uint256 indexed actionNum);

    constructor() {
        owner = payable(msg.sender);
    }


    function doAction(
        uint256 actionNum
    ) external returns (bool success) {
        emit NonIndexedAction(payable(msg.sender), actionNum);
        emit IndexedAction(payable(msg.sender), actionNum);
        return true;
    }

}
