import { ethers } from "hardhat";

export const deployVerifier = async () =>{
    const accounts = await ethers.getSigners();
    const bankContractFactory = await ethers.getContractFactory("Verifier",accounts[0]);
    const bankContractInstance = await bankContractFactory.deploy();
    await bankContractInstance.deployed();
    console.log("Successfully deployed bank contract at ", bankContractInstance.address);
    return bankContractInstance;
}
