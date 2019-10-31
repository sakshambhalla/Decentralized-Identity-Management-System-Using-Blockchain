const contracts = [ artifacts.require("Digital_Identity") ];

module.exports = _deployer =>
  contracts.map(_contract =>
    _deployer.deploy(_contract))