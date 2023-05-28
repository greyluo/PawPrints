const Web3 = require("web3");
require("dotenv").config();

const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("./build/contracts/PawPrints.json"));
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
const Tx = require('@ethereumjs/tx').Transaction;

async function deploy() {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
    // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
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
  console.log(
    `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`
  );
}

async function CreateAccount(){
    var usr = web3.eth.accounts.create();
    console.log(usr);
}

// parameters ownerId, petId, billAmount, recordId, ownerAddress
async function CreateMedicalRecord(contractAddress, hospitalAddress, privateKey) {
    //web3.eth.accounts.wallet.add(privateKey);
    var PawPrints = new web3.eth.Contract(abi, contractAddress);
    const encoded = PawPrints.methods.newMedicalRecord(100, 101, 102, 103, '0x8e678e6E5Af6169de14E9bF145415Be95099f512').encodeABI();
    var tx = {
      from: hospitalAddress,
      to: contractAddress,
      gas: 100000,
      data: encoded
    }

    web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
      web3.eth.sendSignedTransaction(signed.rawTransaction);
    })
}


async function ViewMedicalRecord(contractAddress){
    var PawPrints = new web3.eth.Contract(abi, contractAddress);
    
    var record = await PawPrints.methods.getMedicalRecord().call();
    console.log("Medical Record: ", record);
    return record;
}


function setInsurance(contractAddress, ownerAddress, insuranceAddress, privateKey){
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  const encoded = PawPrints.methods.setInsurance(insuranceAddress).encodeABI();
  var tx = {
    from: ownerAddress,
    to: contractAddress,
    gas: 100000,
    data: encoded
  }

  web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    web3.eth.sendSignedTransaction(signed.rawTransaction);
  })
}

function verify (contractAddress, insuranceAddress, validHospital, overR, privateKey){
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  const encoded = PawPrints.methods.verify(insuranceAddress,validHospital,overR).encodeABI();
  var tx = {
    from: insuranceAddress,
    to: contractAddress,
    gas: 150000,
    data: encoded
  }

  web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log);
  })
}

function reimbursement (contractAddress, insuranceAddress, privateKey){
  var PawPrints = new web3.eth.Contract(abi, contractAddress);
  const encoded = PawPrints.methods.reimbursement().encodeABI();
  var tx = {
    from: insuranceAddress,
    to: contractAddress,
    gas: 150000,
    data: encoded
  }

  web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log);
  })
}
//deploy();
//ViewMedicalRecord("0xa03d197a86D38BEb02724C4C36b02B74b00511cc");
//CreateMedicalRecord("0xa03d197a86D38BEb02724C4C36b02B74b00511cc","0x6854A7AE3Ed273e0e7C83d757b6d7F98BCcee8Fb","8a44399ff29f878fdfa6cd371f7a7e6655240c211ceea62ea0566fe7bc82dbfe");
ViewMedicalRecord("0xa03d197a86D38BEb02724C4C36b02B74b00511cc");
//ViewMedicalRecord("0x3614be9d07890ca45876df070de5fddfcb9b296b");
//CreateAccount();

// setInsurance("0xa03d197a86D38BEb02724C4C36b02B74b00511cc",
//              "0x8e678e6E5Af6169de14E9bF145415Be95099f512",
//              "0xDbeD1643BC6CDd7983d51Fac486723bBA75DE418",
//              "13dc546d95ec0ced649e952525715c9c72cee644bb030f0f7dc19e71d3f3f126"
// )

// verify("0xa03d197a86D38BEb02724C4C36b02B74b00511cc",
//        "0xDbeD1643BC6CDd7983d51Fac486723bBA75DE418",
//        true,
//        true,
//        "b62a3f374c077485c66ede3c6d706379e629d361e56b5285bda1923e07c2ebe3"
// )

reimbursement("0xa03d197a86D38BEb02724C4C36b02B74b00511cc",
              "0xDbeD1643BC6CDd7983d51Fac486723bBA75DE418",
              "b62a3f374c077485c66ede3c6d706379e629d361e56b5285bda1923e07c2ebe3"
)