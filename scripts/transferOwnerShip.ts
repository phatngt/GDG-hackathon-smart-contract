import { ethers } from "hardhat"

export const transferOwnerShip = async (_AWBCTokenAddress:string,_bankContractAddress:string):Promise<void> =>{
    const accounts = await ethers.getSigners();
    const AWBCTokenContractFactory = await ethers.getContractFactory("AWBCToken",accounts[0]);
    const AWBCContractInstance = await AWBCTokenContractFactory.attach(_AWBCTokenAddress);
    await AWBCContractInstance.transferOwnership(_bankContractAddress);
    console.log("Successfully transfer owner for AWBCToken, owner is ", _bankContractAddress);
}
