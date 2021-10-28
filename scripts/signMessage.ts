import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "hardhat"

export const signMessage = (recipient:string, amount:BigNumber,nonce:number,contractAddress:string) =>{
    let hash = ethers.utils.solidityKeccak256(
        ["address","uint256","uint256","address"],
        [recipient,amount,nonce,contractAddress]);
    return hash;
}
