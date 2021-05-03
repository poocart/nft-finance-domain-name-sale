const mintConfig = require('../mintConfig.json');
const NFTFinanceDomainNameToken = artifacts.require("NFTFinanceDomainNameToken");

module.exports = function (deployer, network, accounts) {
  const to = network === 'test' ? accounts[1] : mintConfig.to
  deployer.deploy(NFTFinanceDomainNameToken, mintConfig.uri, to);
};
