import React, { useState } from 'react';
import styled from 'styled-components';
import Onboard from 'bnc-onboard';
import { ethers } from 'ethers';
import axios from 'axios';

const Wrapper = styled.div`
  margin: 0 auto;
  width: 450px;
  max-width: 100%;
`;

const InnerWrapper = styled.div`
  padding: 50px 25px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Link = styled.a`
  &:hover {
    opacity: 0.7;
  }
`;

const PreviewDetailLink = styled.a`
  text-transform: uppercase;
  font-family: "Roboto Condensed", sans;
  font-weight: 700;
  font-size: 14px;
  &, &:visited {
    text-decoration: none;
    color: #000;
  }
  
  &:hover {
    text-decoration: underline;
    color: #000;
  }
  
  border-radius: 5px;
  padding: 3px 7px;
  border: 1px solid #000;
`;

const PreviewDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 35px;
`;

const Paragraph = styled.p`
  font-family: "Roboto Condensed", sans;
  font-weight: 400;
  font-size: 18px;
  margin: 35px 0 0;
  padding: 0;
  text-align: center;
`;

// box-shadow: 0 18px 36px -18px rgb(0 0 0 / 30%), 0 30px 60px -12px rgb(50 50 93 / 25%), 0 -12px 36px -8px rgb(0 0 0 / 3%);

const PreviewImageWrapper = styled.div`
  width: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before, &::after {
    background-image: linear-gradient(-180deg, #4ffdff 0%, #4ffdff 97%);
    content: '';
    height: 100%;
    position: absolute;
    transition: all .1s;
    transform: translateY(0px) translateX(0px);
    width: 100%;
    z-index: -1;
  }

  &::after {
    background-image: linear-gradient(0deg, #0036ff 0%, #0036ff 97%);
  }

  &:hover {
    &::before {
      transform: translateY(-20px) translateX(-20px);
    }
    &::after {
      transform: translateY(20px) translateX(20px);
    }
  }
`;

const PreviewImage = styled.img`
  width: 100%;
`;

const ClaimButton = styled.button`
  border-radius: 5px;
  padding: 15px;
  color: #fff;
  border: none;
  background: ${({ disabled }) => disabled ? '#ddd' : '#8234FF'};
  font-family: "Roboto Condensed", sans;
  font-weight: 600;
  font-size: 15px;
  margin-top: 25px;
  cursor: ${({ disabled }) => disabled ? 'inherit' : 'pointer'};
  text-transform: uppercase;
  &, &:focus {
    outline: none;
  }
  &:hover { ${({ disabled }) => disabled ? '' : 'opacity: 0.8;'} }
`;

const ClaimError = styled.p`
  font-family: "Roboto Condensed", sans;
  font-weight: 400;
  font-size: 18px;
  margin: 15px 0 0;
  color: #ff0000;
  padding: 0;
  text-align: center;
`;

const ClaimSuccess = styled.p`
  font-family: "Roboto Condensed", sans;
  font-weight: 400;
  font-size: 30px;
  padding: 15px;
  margin: 35px 0 0;
  color: #fff;
  background: #5CC100;
  text-align: center;
  border-radius: 5px;
`;

let web3Provider;

const walletService = Onboard({
  dappId: process.env.REACT_APP_BLOCKNATIVE_API_KEY,
  subscriptions: {
    wallet: ({ provider }) => {
      web3Provider = new ethers.providers.Web3Provider(provider);
    },
  },
  networkId: +process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID,
});

const App = () => {
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimErrorMessage, setClaimErrorMessage] = useState(null);
  const [transferAuthCode, setTransferAuthCode] = useState(null);

  const onClaimPress = async () => {
    if (claimLoading) return;

    setClaimErrorMessage(null);
    setClaimLoading(true);

    await walletService.walletSelect().catch(() => null);
    await walletService.walletCheck().catch(() => null);

    if (!web3Provider) {
      setClaimErrorMessage('Unable to connect wallet.');
      setClaimLoading(false);
      return;
    }

    const web3Signer = web3Provider.getSigner();
    const messageBytes = ethers.utils.toUtf8Bytes('NFT.finance TLD verify message 🔐');
    const signedMessage = await web3Signer.signMessage(messageBytes).catch(() => null);
    if (!signedMessage) {
      setClaimErrorMessage('Unable to get signature.');
      setClaimLoading(false);
      return;
    }

    const authCode = await axios.get(`${process.env.REACT_APP_CLAIM_SERVICE_HOST}?verify=${signedMessage}`)
      .then(({ data }) => data?.code)
      .catch(() => null);

    if (!authCode) {
      setClaimErrorMessage('Unable to verify owner.');
      setClaimLoading(false);
      return;
    }

    setTransferAuthCode(authCode);

    setClaimLoading(false);
  };

  return (
    <Wrapper>
      <InnerWrapper>
        <Link href="https://opensea.io/assets/0x357eee542e3b1ec33c1b656f945297f3aaf12129/1" title="View sale">
          <PreviewImageWrapper>
            <PreviewImage src="https://gateway.pinata.cloud/ipfs/QmVBZmp3HYyWVbMwccN55KN8BS3vjPNMxqhahPuRg8uG8g" />
          </PreviewImageWrapper>
        </Link>
        <PreviewDetails>
          <PreviewDetailLink href="https://etherscan.io/address/0x357eee542e3b1ec33c1b656f945297f3aaf12129" title="View on Blockchain" target="_blank">Etherscan</PreviewDetailLink>
          <PreviewDetailLink href="https://opensea.io/assets/0x357eee542e3b1ec33c1b656f945297f3aaf12129/1" title="View on OpenSea">OpenSea</PreviewDetailLink>
          <PreviewDetailLink href="https://t.me/joinchat/GQAcYNw1Yl85ZTk0" title="View on Telegram" target="_blank">Telegram</PreviewDetailLink>
          <PreviewDetailLink href="https://deimantasspucys.medium.com/nft-finance-top-level-domain-name-sale-as-nft-itself-9269cc0d13d7" title="View on Medium" target="_blank">Medium</PreviewDetailLink>
          <PreviewDetailLink href="https://discord.gg/74pcw3VKcx" title="View on Discord" target="_blank">Discord</PreviewDetailLink>
        </PreviewDetails>
        <Paragraph>
          Top level domain name tokenized as ERC-721 NFT is <strong>for sale</strong> on OpenSea.
          Domain will be transferred to the final highest bidder – transfer claim link will appear once auction is over.
          Feel free to reach me on Telegram or Discord.
        </Paragraph>
        <Paragraph>
          <u>Once sold, this domain price will be set publicly forever!</u>
        </Paragraph>
        {!transferAuthCode && (
          <ClaimButton
            onClick={onClaimPress}
            disabled={claimLoading}
          >
            {claimLoading && `Claiming...`}
            {!claimLoading && `Claim auth code`}
          </ClaimButton>
        )}
        {transferAuthCode && <ClaimSuccess>ICANN transfer code: {transferAuthCode}</ClaimSuccess>}
        {claimErrorMessage && <ClaimError>{claimErrorMessage}</ClaimError>}
      </InnerWrapper>
    </Wrapper>
  );
}

export default App;
