//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract AWBCToken is Ownable, ERC20("Alpha Wolf BC","AWBC") {

    constructor(){
        // _mint(msg.sender, 100*10**18);
    }

    function mint(address to, uint256 amount) onlyOwner public {
        require(to != address(0));
        _mint(to, amount);
    }

    function approve(address from, address spender, uint256 amount) public returns(bool){
        _approve(from, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = allowance(sender,recipient);
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

}
