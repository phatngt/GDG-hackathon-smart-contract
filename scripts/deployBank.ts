import { ethers } from "hardhat"
import { Bank } from "../typechain";

export const deployBank = async (_tokenAddress:string):Promise<Bank> => {
    const accounts = await ethers.getSigners();
    const bankContractFactory = await ethers.getContractFactory("Bank",accounts[0]);
    const bankContractInstance = await bankContractFactory.deploy(_tokenAddress);
    await bankContractInstance.deployed();
    console.log("Successfully deployed bank contract at ", bankContractInstance.address);
    return bankContractInstance;
}
