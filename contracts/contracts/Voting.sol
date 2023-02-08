// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/*
This smart contract implements a voting system for two candidates, "BOB" and "ALICE." 
It uses an enumeration type, "Candidates," to define the possible candidates. 
The "voters" mapping keeps track of which addresses have voted, while the "votes" mapping 
keeps a tally of the number of votes each candidate has received. 
The "vote" function allows a voter to cast their vote by passing in their preferred candidate. 
The "totalVotes" function calculates the total number of votes cast and 
the "winner" function returns the candidate who has received the most votes, 
given that a total of 100 votes have been cast.
*/
contract Voting {
    enum Candidates { BOB, ALICE }
    mapping(address => bool) public voters;
    mapping(Candidates => uint256) public votes;

    event VoteCast(address voter, Candidates candidate);

    constructor() {
        votes[Candidates.BOB] = 0;
        votes[Candidates.ALICE] = 0;
    }

    function vote(Candidates candidate) public {
        require(!voters[msg.sender], "You have already voted.");
        require( candidate == Candidates.BOB || candidate == Candidates.ALICE, "Invalid candidate.");
        voters[msg.sender] = true;
        votes[candidate]++;
        emit VoteCast(msg.sender, candidate);
    }

    function totalVotes() private view returns (uint256) {
        return votes[Candidates.BOB] + votes[Candidates.ALICE];
    }

     function winner() public view returns (Candidates) {
        require(totalVotes() == 100);
        if (votes[Candidates.BOB] > votes[Candidates.ALICE]) {
            return Candidates.BOB;
        } else {
            return Candidates.ALICE;
        }
    }

}
