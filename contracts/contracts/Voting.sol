// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/*
This smart contract implements a voting system for two Candidates, "BOB" and "ALICE." 
It uses an enumeration type, "Candidates," to define the possible Candidates. 
The "votes" mapping keeps a tally of the number of votes each candidate has received.
The "voters" mapping keeps track of which addresses have voted.
The "vote" function allows a voter to cast their vote by passing in their preferred candidate. 
The "totalVotes" function calculates the total number of votes cast.
The "winner" function returns the candidate who has received the most votes, 
given that a total of 100 votes have been cast.
*/
contract Voting {
    enum Candidates { BOB, ALICE }
    mapping(Candidates => uint256) public votes;
    mapping(address => bool) public voters;

    constructor() {
        votes[Candidates.BOB] = 1;
        votes[Candidates.ALICE] = 1;
        voters[0x8fA8016921a4Cd240433e8fA872b7750Ee3A66d9] = true;
        voters[0xA0FcD37Ce5AB17541d5D928fE153d8ea135b7ffB] = true;
    }

    function totalVotes() public view returns (uint256) {
        return votes[Candidates.BOB] + votes[Candidates.ALICE];
    }

    function vote(Candidates candidate) public {
        require(!voters[msg.sender], "You have already voted.");
        require(totalVotes() < 10, "The total number of votes is 10.");
        voters[msg.sender] = true;
        votes[candidate]++;
    }

    function winner() public view returns (Candidates) {
        require(totalVotes() == 10);
        if (votes[Candidates.BOB] > votes[Candidates.ALICE]) {
            return Candidates.BOB;
        } else {
            return Candidates.ALICE;
        }
    }

}
