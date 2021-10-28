// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;
import "hardhat/console.sol";
import "./AWBCToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Bank {
    mapping(address => uint256) private _balanceOf;
    AWBCToken public _token;
    mapping(address=>mapping(uint256 => bool)) private usedNonces;
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
        require(!usedNonces[msg.sender][nonce], "Nonce has used");
        usedNonces[msg.sender][nonce] = true;
        bytes32 rawMessage = keccak256(abi.encodePacked(msg.sender, amount,nonce,address(this)));
        bytes memory s =  abi.encodePacked(rawMessage);
        bytes32 message = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n",Strings.toString(s.length),s));
        require(isValidAccessMessage(message, signature),"Message isn't correct");
        if(_balanceOf[msg.sender] < amount ){
            uint256 remaining = amount -_balanceOf[msg.sender];
            _balanceOf[msg.sender] += remaining;
            if(_token.balanceOf(address(this)) < _balanceOf[msg.sender]){
                _token.mint(address(this),remaining);
            }
        }

        _token.approve(address(this),msg.sender,0);
        _token.approve(address(this),msg.sender,amount);

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

    function isValidAccessMessage(bytes32 message, bytes memory signature) public view returns (bool){
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        return ecrecover(message,v,r,s) == _owner;
    }


}
