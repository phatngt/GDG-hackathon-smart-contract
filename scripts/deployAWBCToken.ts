import { utils } from "ethers";
import { ethers } from "hardhat"
import { AWBCToken } from "../typechain";

export const deployAWBCToken = async ():Promise<AWBCToken> => {
    const accounts = await ethers.getSigners();
    const AWBCTokenContractFactory = await ethers.getContractFactory("AWBCToken",accounts[0]);
    const AWBCContractInstance = await AWBCTokenContractFactory.deploy();
    await AWBCContractInstance.deployed();
    console.log("Successfully deployed AWBCToken contract at ", AWBCContractInstance.address);
    await AWBCContractInstance.mint(accounts[0].address,utils.parseEther("100"));
    return AWBCContractInstance;
}
