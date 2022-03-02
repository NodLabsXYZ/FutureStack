import {
  getEthereumGasEstimate,
  ethereumNetworkIdToName
} from '../lib'

import {
  BoldKeyAndValue
} from '.'

import { ethers } from 'ethers';
import { useEffect, useMemo, useRef, useState } from 'react';

const EthereumGasEstimateInformation = ({ provider, contract, deploymentArguments }) => {
  const [network, setNetwork] = useState();
  const [gasEstimate, setGasEstimate] = useState();
  const [gasPrice, setGasPrice] = useState();
  const gasPriceTimeout = useRef();

  const getAndSetGasPrice = useMemo(() => async () => {
    const gasPrice = await provider.getGasPrice();
    setGasPrice(gasPrice);
  }, [provider])

  useEffect(() => {
    if (gasEstimate && !deploymentArguments) {
      setGasEstimate(null)
    }

    if (!deploymentArguments) {
      return;
    }

    const getGasEstimate = async () => {
      const gasEstimateInfo = await getEthereumGasEstimate(
        provider,
        contract.info.abi,
        contract.info.bytecode,
        deploymentArguments
      );
      setNetwork(gasEstimateInfo.network);
      setGasEstimate(gasEstimateInfo.gas);
    }

    getGasEstimate()
    getAndSetGasPrice()
  }, [gasEstimate, provider, contract, deploymentArguments, getAndSetGasPrice])

  useEffect(() => {
    if (gasPriceTimeout.current) {
      clearTimeout(gasPriceTimeout.current);
    }

    gasPriceTimeout.current = setTimeout(getAndSetGasPrice, 1000)
  }, [gasPrice, getAndSetGasPrice])
  
  if (!deploymentArguments) {
    return (
      <div className='text-xs py-6'>
        Provide deployment arguments to get
        <br/>
        an estimate on gas or deploy the contract.
      </div>
    )
  }

  const readableGasPrice = gasPrice ? (
    Math.round(
      (ethers.utils.formatUnits(gasPrice, "gwei") * 100)
    ) / 100
  ) : null;

  const estimatedCost = (gasEstimate && gasPrice) ? (
    Math.round(
      ethers.utils.formatEther(
        ethers.BigNumber.from(gasEstimate).mul(ethers.BigNumber.from(gasPrice))
      ) * 100000
    ) / 100000
  ) : null;

  return (
    <div>
      {network && 
        <BoldKeyAndValue
          title="Network"
          value={ethereumNetworkIdToName(network)}
        />
      }
      {gasEstimate &&
        <BoldKeyAndValue
          title="Gas"
          value={ethers.utils.commify(gasEstimate)}
        />
      }
      {readableGasPrice && 
        <BoldKeyAndValue
          title="Gas Price"
          value={`${readableGasPrice} GWEI`}
        />
      }
      {estimatedCost !== null &&
        <BoldKeyAndValue
          title="Transaction Cost"
          value={`${estimatedCost} ETH`}
        />      
      }
    </div>
  )

}

export default EthereumGasEstimateInformation;