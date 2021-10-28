import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Signer, utils, Wallet } from "ethers";
import { ethers} from "hardhat";
import { deployAWBCToken } from "../scripts/deployAWBCToken";
import { deployBank } from "../scripts/deployBank";
import { deployVerifier } from "../scripts/deployVerifier";
import { signMessage } from "../scripts/signMessage";
import { transferOwnerShip } from "../scripts/transferOwnerShip";
import { AWBCToken, Bank, Verifier } from "../typechain";

let deployer:SignerWithAddress;
let user:SignerWithAddress;
let walletAccount:Wallet;
let AWBCTokenInstance:AWBCToken;
let bankContractInstance:Bank;
let verifierContract:Verifier;
const privateKey = "0xa2e2a5aa15a975a583bcc4ce5f2ea3bce81307b999635af3955e190cda4f500e";
let accounts:string[];
describe("Full flow",  ()=>{
  before(async ()=>{

    [deployer,user] = await ethers.getSigners();
    AWBCTokenInstance = await deployAWBCToken();
    bankContractInstance = await deployBank(AWBCTokenInstance.address);
    await transferOwnerShip(AWBCTokenInstance.address, bankContractInstance.address);
    verifierContract = await deployVerifier();
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
    // console.log("deployer: ", deployer);
    // console.log("user: ", user.address);
    const nonce = await user.getTransactionCount();
    const message =  signMessage(user.address,utils.parseEther("30"),0,bankContractInstance.address);
    console.log("message: ", message);
    const sig = await deployer.signMessage(message);
    // console.log("sig: " + sig);
    let subsig = ethers.utils.splitSignature(sig);
    // console.log("subsig-s: ", subsig.s);
    // console.log("subsig-v: ", subsig.v);
    // console.log("subsig-r: ", subsig.r);
    let recovered = await verifierContract.verifyString(message, subsig.v, subsig.r, subsig.s);

console.log("recovery" ,recovered);
    const tx = await bankContractInstance.connect(user).withdraw(utils.parseEther("30"),0,sig,message);
    const receipt = tx.wait();
    console.log("receipt: " + receipt);

})});
