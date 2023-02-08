// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Example {

    address owner;

    constructor() {}

    function multiplication(uint256 a, uint256 b) public pure returns (uint256) {
        return a * b;
    }

    function addition(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    function balance(address add) public view returns (uint256) {
        return address(add).balance;
    }

    function hash(string memory _string) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_string));
    }

    function setOwner(address _owner) external {
        owner = _owner;
    }

    function infinite() public pure returns(string memory) {
        uint i = 1;
        uint c = 0;
        while(i == 1){
            c = c + 1;
        }
        return "end";
    }
}
