// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;
import "hardhat/console.sol";
import "./AWBCToken.sol";
contract Bank {
    mapping(address => uint256) private _balanceOf;
    AWBCToken public _token;
    mapping(uint256 => bool) private usedNonces;
    address private _owner;

    event Deposit(address indexed from, uint256 indexed amount);
    event Withdraw(address indexed from, uint256 indexed amount);

    constructor(address token) {
        _token = AWBCToken(token);
        _owner = msg.sender;
    }

    function balanceOf(address user) public view returns(uint256){
        return _balanceOf[user];
    }

    function deposit(uint256 amount) public {
        require(amount > 0 , "Amount must is than 0");
        _token.approve(msg.sender,address(this),  0);
        _token.approve(msg.sender,address(this), amount);
        _token.transferFrom(msg.sender,address(this),amount);
        _balanceOf[msg.sender] += amount;
        emit Deposit(msg.sender,amount);
    }

    function withdraw(uint256 amount, uint256 nonce, bytes memory signature) public{
        require(!usedNonces[nonce], "Nonce has used");
        usedNonces[nonce] = true;
        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, amount,nonce,address(this))));
        require(isValidAccessMessage(message, signature),"Message isn't correct");
        require(_balanceOf[msg.sender] >= amount, "Balance is not enought");
        unchecked {
            _balanceOf[msg.sender] -= amount;
        }
        _token.transferFrom(address(this),msg.sender, amount);

        emit Withdraw(msg.sender,amount);

    }

    function splitSignature(bytes memory sig)internal pure returns(uint8 v, bytes32 r, bytes32 s) {
        require(sig.length == 65, "Signature isn't validate");
        assembly {
            // first 32 bytes, after the length prefix.
            r := mload(add(sig, 32))
            // second 32 bytes.
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes).
            v := byte(0, mload(add(sig, 96)))
        }
        return (v,r,s);
    }

    function isValidAccessMessage(bytes32 message, bytes memory signature) internal view returns (bool){
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        return ecrecover(message,v,r,s) == _owner;
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32){
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",hash));
    }
}
