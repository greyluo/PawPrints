const Web3 = require("web3");
// require("dotenv").config();

const fs = require("fs");
const { create } = require("domain");
const { abi, bytecode } = JSON.parse(fs.readFileSync("../backend/build/contracts/PawPrints.json"));
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');

async function CreateAccount() {
    var newAccount = web3.eth.accounts.create();
    newAddress = newAccount.address;
    key = newAccount.privateKey;

    console.log("Account created with public address: ", newAddress);
    console.log("Private Key: ", key);
}

async function transact() {
    const faucet = "0xa6A9C9386F3eE34Ce21BD2d40c1e6e3BFDc3C7EF";
    const amount = web3.utils.toWei('0.4999', 'ether'); // 1 MATIC
    const gasLimit = 21000; // Gas limit for a basic transfer
    const tx = {
        to: faucet,
        value: amount,
        gas: gasLimit
    };

    sign(tx, key);
}

var key = "0x6b4662410e4420b5c83835f81b44a6a077de923cfec7462b047f445fef938ae9";

function sign(tx, privateKey) {
  web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    web3.eth.sendSignedTransaction(signed.rawTransaction)
      .on('transactionHash', (hash) => {
        console.log('Transaction hash:', hash);
        // You can use the transaction hash for further operations or tracking
      })
      // .on('confirmation', (confirmationNumber) => {
      //   // Transaction confirmation event
      //   console.log('Confirmation number:', confirmationNumber);
      // })
      .on('error', (error) => {
        // Transaction error event
        console.error('Error:', error);
      });
  });
}

CreateAccount();
//transact();