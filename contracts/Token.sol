//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    address private owner;
    string public name;
    string public symbol;
    uint256 public totalSupply;
    mapping(address => uint256) balances;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        console.log("Deploy new token with total supply:", _totalSupply);
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function transfer(address _to, uint256 amount) external {
        // console.log("sender", msg.sender);
        // console.log("recipient", _to);
        // console.log("amount", amount);
        require(balances[msg.sender] >= amount, "Not enough balance");
        balances[msg.sender] -= amount;
        balances[_to] += amount;
    }

    function balanceOf(address _account) external view returns (uint256) {
        return balances[_account];
    }
}
