var Contract1 = artifacts.require("./PawPrints.sol")
var Contract2 = artifacts.require("./insurance.sol")

module.exports = function (deployer) {
    deployer.deploy(Contract1)
    deployer.deploy(Contract2)
}