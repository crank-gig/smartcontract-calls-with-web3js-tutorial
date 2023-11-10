// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoFundMia {
    address public owner;
    uint public totalDonation;

    event DonationReceived(address indexed sender, uint amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        totalDonation += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdrawFunds() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
        totalDonation = 0; // Reset the total donation after withdrawal
    }
}
