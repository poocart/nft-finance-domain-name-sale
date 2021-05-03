const mintConfig = require('../mintConfig.json');
const NFTFinanceDomainNameToken = artifacts.require('NFTFinanceDomainNameToken');

const tokenId = 1;

contract("NFTFinanceDomainNameToken", ([deployerAddress, address1, address2]) => {
  it("get the size of the contract", async () => {
    const contractInstance = await NFTFinanceDomainNameToken.deployed();
    var bytecode = contractInstance.constructor._json.bytecode;
    var deployed = contractInstance.constructor._json.deployedBytecode;

    var sizeOfB  = bytecode.length / 2;
    var sizeOfD  = deployed.length / 2;
    console.log("size of bytecode in bytes = ", sizeOfB);
    console.log("size of deployed in bytes = ", sizeOfD);
    console.log("initialisation and constructor code in bytes = ", sizeOfB - sizeOfD);
  });

  it('should deploy successfully', async () => {
    const contractInstance = await NFTFinanceDomainNameToken.deployed();
    const name = await contractInstance.name();
    const symbol = await contractInstance.symbol();
    const tokenUri = await contractInstance.tokenURI(tokenId);
    const ownerAddress = await contractInstance.ownerOf(tokenId);

    assert.equal(name, 'NFT.finance Domain Name');
    assert.equal(symbol, 'NFTFINTLD');
    assert.equal(tokenUri, mintConfig.uri);
    assert.equal(ownerAddress, address1);
  });

  it('should transfer back and forth successfully', async () => {
    const contractInstance = await NFTFinanceDomainNameToken.deployed();

    let currentOwnerAddress = await contractInstance.ownerOf(tokenId);
    assert.equal(currentOwnerAddress, address1);

    await contractInstance.transferFrom(address1, address2, tokenId, { from: address1 });

    currentOwnerAddress = await contractInstance.ownerOf(tokenId);
    assert.equal(currentOwnerAddress, address2);

    await contractInstance.transferFrom(address2, address1, tokenId, { from: address2 });

    currentOwnerAddress = await contractInstance.ownerOf(tokenId);
    assert.equal(currentOwnerAddress, address1);
  });

  it('should not transfer if not owner', async () => {
    const contractInstance = await NFTFinanceDomainNameToken.deployed();

    let currentOwnerAddress = await contractInstance.ownerOf(tokenId);
    assert.equal(currentOwnerAddress, address1);

    await contractInstance.transferFrom(address1, address2, tokenId, { from: address2 });
  });

  it('should not let set new Token URI', async () => {
  });
})
