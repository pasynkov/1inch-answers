// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ArrayStorageSlot {
    address payable public owner;
    uint256 public someNumber;
    uint256[] public someNumberArray;
    bytes32 constant public startingIndexOfValuesArrayElementsInStorage = keccak256(abi.encode(2));

    constructor() {
        owner = payable(msg.sender);
    }

    function setValue(
        uint256 value
    ) external {
        someNumber = value;
        someNumberArray.push(someNumber);
        someNumberArray.push(someNumber + 1);
    }

    function getArray() public view returns(uint256[] memory array) {
        return someNumberArray;
    }

    function getElementIndexInStorage(uint256 _elementIndex) public pure returns(bytes32) {
        return bytes32(uint256(startingIndexOfValuesArrayElementsInStorage) + _elementIndex);
    }

}
