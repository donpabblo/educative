// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageStorage {
    string public message;

    struct PersonalMessage {
        address sender;
        string content;
        bool read;
    }

    mapping(address => PersonalMessage) messages;

    function setMessage(string memory _message) public {
        require(bytes(_message).length <= 256, "Message too long");
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function writePersonalMessage(address _recipient, string memory _message)
        public
        payable
    {
        require(bytes(_message).length <= 256, "Message too long");
        require(_recipient != address(0), "0 Address not allowed");
        require(msg.value >= 1000, "Unsufficient funds");
        require(messages[_recipient].read || messages[_recipient].sender == address(0), "Previous message not read");
        PersonalMessage memory personalMsg;
        personalMsg.sender = msg.sender;
        personalMsg.content = _message;
        personalMsg.read = false;
        messages[_recipient] = personalMsg;
    }

    function readPersonalMessage() public view returns (string memory) {
        return messages[msg.sender].content;
    }

    function markAsRead() public {
        messages[msg.sender].read = true;
    }

    function checkRead() public view returns (bool) {
        return messages[msg.sender].read;
    }
}
