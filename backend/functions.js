const Web3 = require("web3");
require("dotenv").config();

const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("../backend/build/contracts/PawPrints.json"));
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
const Tx = require('@ethereumjs/tx').Transaction;

async function deploy(privateKey) {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
    // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(signer);

  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;
  const deployTx = contract.deploy();
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: 5000000,
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
    });
  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);

  return deployedContract.options.address;
}

async function CreateAccount(){
    var usr = web3.eth.accounts.create();
    console.log(usr);
}

// parameters contractAddress, hospitalAddress, privateKey(of Hospital), ownerId, petId, billAmount, recordId, ownerAddress
async function CreateMedicalRecord(contractAddress, hospitalAddress, privateKey,
                  ownerId, petId, billAmount, recordId, ownerAddress) {
    //web3.eth.accounts.wallet.add(privateKey);
    var PawPrints = new web3.eth.Contract(abi, contractAddress);
    const encoded = PawPrints.methods.newMedicalRecord(ownerId, petId, billAmount, recordId, ownerAddress).encodeABI();
    
    const gasAmount = await web3.eth.estimateGas({
      to: contractAddress,
      from: hospitalAddress,
      data: encoded
    });

    console.log("Estimate Gas: ", gasAmount)
    
    var tx = {
      from: hospitalAddress,
      to: contractAddress,
      gas: gasAmount+1314,
      data: encoded
    }

    sign(tx, privateKey);
}


async function ViewMedicalRecord(contractAddress){
    var PawPrints = new web3.eth.Contract(abi, contractAddress);
    
    var record = await PawPrints.methods.getMedicalRecord().call();
    console.log("Medical Record: ", record);
    return record;
}


async function setInsurance(contractAddress, ownerAddress, insuranceAddress, privateKey){
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  const encoded = PawPrints.methods.setInsurance(insuranceAddress).encodeABI();

  const gasAmount = await web3.eth.estimateGas({
    to: contractAddress,
    from: ownerAddress,
    data: encoded
  });

  var tx = {
    from: ownerAddress,
    to: contractAddress,
    gas: gasAmount+1314,
    data: encoded
  }

  sign(tx, privateKey);
}

async function verify (contractAddress, insuranceAddress, validHospital, overR, privateKey){
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  // const encoded = PawPrints.methods.verify(insuranceAddress,validHospital,overR).encodeABI()
  const verified = PawPrints.methods.verify(insuranceAddress,validHospital,overR)
  const encoded = verified.encodeABI();

  const gasAmount = await web3.eth.estimateGas({
    to: contractAddress,
    from: insuranceAddress,
    data: encoded
  });

  var tx = {
    from: insuranceAddress,
    to: contractAddress,
    gas: gasAmount+1314,
    data: encoded
  }

  sign(tx, privateKey);
}

async function reimbursement (contractAddress, insuranceAddress, privateKey){
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  const encoded = PawPrints.methods.reimbursement().encodeABI();

  const gasAmount = await web3.eth.estimateGas({
    to: contractAddress,
    from: insuranceAddress,
    data: encoded
  });

  var tx = {
    from: insuranceAddress,
    to: contractAddress,
    gas: gasAmount+1314,
    data: encoded
  }

  sign(tx, privateKey);
}

function sign(tx, privateKey){
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


// export {ViewMedicalRecord};

module.exports = {deploy,
                  ViewMedicalRecord, 
                  CreateMedicalRecord, 
                  setInsurance, 
                  CreateAccount, 
                  verify, 
                  reimbursement
};