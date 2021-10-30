import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { utils} from "ethers";
import { ethers} from "hardhat";
import { deployAWBCToken } from "../scripts/deployAWBCToken";
import { deployBank } from "../scripts/deployBank";
import { signMessage } from "../scripts/signMessage";
import { transferOwnerShip } from "../scripts/transferOwnerShip";
import { AWBCToken, Bank} from "../typechain";

let deployer:SignerWithAddress;
let user:SignerWithAddress;
let AWBCTokenInstance:AWBCToken;
let bankContractInstance:Bank;

describe("Full flow",  ()=>{
  before(async ()=>{
    [deployer,user] = await ethers.getSigners();
    AWBCTokenInstance = await deployAWBCToken();
    bankContractInstance = await deployBank(AWBCTokenInstance.address);
    await transferOwnerShip(AWBCTokenInstance.address, bankContractInstance.address);
    // await bankContractInstance.connect(user).deposit(utils.parseEther("50"));
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
  // await bankContractInstance.connect(user).deposit(utils.parseEther("50"));
  // const balanceOfUser = await bankContractInstance.balanceOf(user.address);
  // expect(balanceOfUser.toString()).to.equal(utils.parseEther("50").toString());
  // });

  it("User withdraw the money", async () =>{
    const nonce = await user.getTransactionCount();
    const message =  signMessage(user.address,utils.parseEther("30"),nonce,bankContractInstance.address);
    // console.log("accounts: ", deployer);
    // const message =  signMessage("0xcC1dc9Ba47293B285732538C7aCC0fCd8Db0e69e",utils.parseEther("30"),310,"0x3D56E0Bd3a9ed7b04c19E482578813E8033600Da");

    const sig = await deployer.signMessage(ethers.utils.arrayify(message));
    console.log("sig", sig);

    // const tx = await bankContractInstance.connect(user).withdraw(utils.parseEther("30"),nonce,sig);
    // const receipt = await tx.wait();
    // console.log("receipt: " + receipt);

})});
