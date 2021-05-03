const express = require('express');
const cors = require('cors');
const ethers = require('ethers');

require('dotenv').config();

const contractAbi = require('./abi.json');

const app = express();
const appPort = process.env.PORT || 8000;

app.use(cors());

app.get('/', async (req, res) => {
  let code = null;

  const signedMessage = req.query?.verify;
  if (signedMessage) {
    const provider = new ethers.providers.InfuraProvider(process.env.NETWORK_NAME, process.env.INFURA_API_KEY);
    const contract = new ethers.Contract(process.env.TLD_CONTRACT_ADDRESS, contractAbi, provider);
    const ownerAddress = await contract.ownerOf('1').catch(() => null);
    const messageBytes = ethers.utils.toUtf8Bytes('NFT.finance TLD verify message 🔐');
    const signerAddress = ethers.utils.verifyMessage(messageBytes, signedMessage);

    if (ownerAddress?.length
      && signerAddress?.length
      && ownerAddress.toLowerCase() === signerAddress.toLowerCase()) {
      code = process.env.AUTH_CODE;
    }
  }

  res.json({ code });
});

app.listen(appPort, () => {
  console.log(`service started at port: ${appPort}`);
});
