const Web3 = require("web3");
// require("dotenv").config();

const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("../backend/build/contracts/PawPrints.json"));
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
// const Tx = require('@ethereumjs/tx').Transaction;

async function deploy(privateKey) {
  // Configuring the connection to an Ethereum node
  const network = "Polygon Mumbai Testnet";
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

async function CreateAccount() {
  var newAccount = web3.eth.accounts.create();
  const newAddress = newAccount.address;
  const key = newAccount.privateKey;

  console.log("Account created with public address:", newAddress);
  console.log("Sending 0.01 matic for testing...")
  /**
   * Danger zone
   * 
   * As demo, we will be sending 0.01 matic to the new account
   * for it to perform test transactions, this will be resolved in future
   */
  const amount = web3.utils.toWei('0.01', 'ether'); // 1 MATIC
  const gasLimit = 21000; // Gas limit for a basic transfer
  const tx = {
    to: newAddress,
    value: amount,
    gas: gasLimit
  };

  // Open this on demo day

  // sign(tx,"8a44399ff29f878fdfa6cd371f7a7e6655240c211ceea62ea0566fe7bc82dbfe")
  // .then(
  //   web3.eth.getBalance(newAddress)
  //   .then(balance => {
  //     console.log("Account Balance:", web3.utils.fromWei(balance, 'ether'), "Test MATIC");
  //   })
  //   .catch(error => {
  //     console.error("Error:", error);
  //   })
  // )
  return {Address : newAddress,
          privatekey : key};
}

// parameters contractAddress, hospitalAddress, privateKey(of Hospital), ownerId, petId, billAmount, recordId, ownerAddress
async function CreateMedicalRecord(contractAddress, hospitalAddress, privateKey,
  ownerId, petId, billAmount, recordId, ownerAddress, hash) {
  //web3.eth.accounts.wallet.add(privateKey);
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  const encoded = PawPrints.methods.newMedicalRecord(ownerId, petId, billAmount, recordId, ownerAddress, hash).encodeABI();

  const gasAmount = await web3.eth.estimateGas({
    to: contractAddress,
    from: hospitalAddress,
    data: encoded
  });

  console.log("Estimate Gas: ", gasAmount)

  var tx = {
    from: hospitalAddress,
    to: contractAddress,
    gas: gasAmount + 1314,
    data: encoded
  }

  sign(tx, privateKey);
}


async function ViewMedicalRecord(contractAddress) {
  var PawPrints = new web3.eth.Contract(abi, contractAddress);

  var record = await PawPrints.methods.getMedicalRecord().call();
  console.log("Medical Record: ", record);
  return record;
}


async function setInsurance(contractAddress, ownerAddress, insuranceAddress, privateKey) {
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
    gas: gasAmount + 1314,
    data: encoded
  }

  sign(tx, privateKey);
}

async function verify(contractAddress, insuranceAddress, validHospital, overR, privateKey) {
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  // const encoded = PawPrints.methods.verify(insuranceAddress,validHospital,overR).encodeABI()
  const verified = PawPrints.methods.verify(insuranceAddress, validHospital, overR)
  const encoded = verified.encodeABI();

  const gasAmount = await web3.eth.estimateGas({
    to: contractAddress,
    from: insuranceAddress,
    data: encoded
  });

  var tx = {
    from: insuranceAddress,
    to: contractAddress,
    gas: gasAmount + 1314,
    data: encoded
  }

  sign(tx, privateKey);
}

async function reimbursement(contractAddress, insuranceAddress, privateKey) {
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
    gas: gasAmount + 1314,
    data: encoded
  }

  sign(tx, privateKey);
}

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

async function getAddresses(contractAddress) {
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  const ownerAddress = await PawPrints.methods.owner().call();
  const insuranceAddress = await PawPrints.methods.insuranceProvider().call();
  const hospitalAddress = await PawPrints.methods.hospital().call();

  console.log("ownerAddress: ", ownerAddress);
  console.log("hospitalAddress: ", hospitalAddress);
  console.log("insurance: ", insuranceAddress);
}

// export {ViewMedicalRecord};

module.exports = {
  deploy,
  ViewMedicalRecord,
  CreateMedicalRecord,
  setInsurance,
  CreateAccount,
  verify,
  reimbursement,
  getAddresses
};

//getAddresses("0x83b4F166e1eA0f04238f0a7a0347275895CaC0D0");

//CreateAccount();