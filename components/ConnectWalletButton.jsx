import {
  TWCircleSpinner,
  Web3ModalConnectButton,
  EnsureCorrectEthereumNetwork
} from '.'

import { useEffect, useState } from 'react';
import Web3Modal from "web3modal";

const ConnectWalletButton = ({ providerOptions, network, onConnect }) => {  
  const [web3Modal, setWeb3Modal] = useState()
  const [provider, setProvider] = useState()

  useEffect(() => {
    const modal = new Web3Modal({
      providerOptions,
      network: network,
      cacheProvider: false,
      disableInjectedProvider: false
    })

    setWeb3Modal(modal);
  }, [network, providerOptions])

  if (!web3Modal) {
    return (
      <TWCircleSpinner />
    )
  }

  if (!provider) {
    return (
      <Web3ModalConnectButton
        web3Modal={web3Modal}
        onConnect={setProvider}
      />
    );
  }

  return (
    <EnsureCorrectEthereumNetwork 
      provider={provider}
      network={network}
      onCorrectNetwork={() => {
        onConnect(provider)
      }}
    />
  );
}

ConnectWalletButton.defaultProps = {
  providerOptions: {}
}

export default ConnectWalletButton;