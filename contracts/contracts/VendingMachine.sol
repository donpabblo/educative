//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VendingMachine {
    address public owner;
    uint256 public bottlesInStock;
    mapping(address => uint256) public purchased;

    constructor() {
        owner = msg.sender;
        bottlesInStock = 100;
    }

    function restock(uint256 amount) public {
        require(msg.sender == owner, "Only owner can restock the bottles!");
        bottlesInStock = bottlesInStock + amount;
    }

    function purchase() public payable {
        require(msg.value >= 0.1 ether, "You must pay at least 0.1 ether");
        require(bottlesInStock >= 1, "OOPS! Not enough bottles");
        bottlesInStock = bottlesInStock - 1;
        purchased[address(msg.sender)] = purchased[address(msg.sender)] + 1;
    }

    function purchaseMultiple(uint256 amount) public payable {
        require(msg.value >= amount * 0.1 ether, "You must pay at least 0.1 ether per bottle");
        require(bottlesInStock >= amount, "OOPS! Not enough bottles");
        bottlesInStock = bottlesInStock - amount;
        purchased[address(msg.sender)] = purchased[address(msg.sender)] + amount;
    }
}
