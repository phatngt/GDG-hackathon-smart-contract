import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";
import { deployAWBCToken } from "../scripts/deployAWBCToken";
import { deployBank } from "../scripts/deployBank";
import { signMessage } from "../scripts/signMessage";
import { transferOwnerShip } from "../scripts/transferOwnerShip";
import { AWBCToken, Bank } from "../typechain";


let deployer:SignerWithAddress;
let user:SignerWithAddress
let AWBCTokenInstance:AWBCToken;
let bankContractInstance:Bank
describe("Full flow",  ()=>{
  before(async ()=>{
    [deployer,user] = await ethers.getSigners();
    AWBCTokenInstance = await deployAWBCToken();
    bankContractInstance = await deployBank(AWBCTokenInstance.address);
    await transferOwnerShip(AWBCTokenInstance.address, bankContractInstance.address);
  });

  // it("User has 100 ether", async ()=>{
  //   const _balaceOfUser = await AWBCTokenInstance.balanceOf(user.address);
  //   expect(_balaceOfUser.toString()).to.equal(utils.parseEther("100").toString());
  // });

  // it("Owner of the AWBCToken is bank contract", async ()=>{
  //   const owner = await AWBCTokenInstance.owner();
  //   expect(owner.toString()).to.equal(bankContractInstance.address);
  // });

  // it("User deposit to bank with amount is 50 ether", async ()=>{
  //   console.log("user address",user.address);
  //   await bankContractInstance.connect(user).deposit(utils.parseEther("50"));
  //   const balanceOfUser = await bankContractInstance.balanceOf(user.address);
  //   expect(balanceOfUser.toString()).to.equal(utils.parseEther("50").toString());
  // });

  it("User withdraw the money", async () =>{
    const nonce = await user.getTransactionCount();
    const message =  signMessage(user.address,utils.parseEther("50"),nonce,bankContractInstance.address);
    console.log("hashMessage", message);
    const signature = await deployer.signMessage(message);
    console.log("signature: ", signature);
  });

});
