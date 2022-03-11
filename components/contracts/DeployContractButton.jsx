import {
  ethereumNetworkIdToName
} from '../../lib'

import {
  TWButton
} from '..'

import { ethers } from 'ethers';
import { useState } from 'react';

const DeployContractButton = ({ provider, abi, bytecode, deploymentArguments, onDeploy }) => {
  const [deploying, setDeploying] = useState(false);

  const deployContract = async () => {
    if (deploying) return;
    setDeploying(true)
    const { chainId } = await provider.getNetwork()
    const networkName = ethereumNetworkIdToName(chainId)

    const confirmationMessage = `Are you sure you want to deploy this contract on the ${networkName} network?`
    if (confirm(confirmationMessage)) {
      const signer = provider.getSigner()
      const factory = new ethers.ContractFactory(abi, bytecode, signer);

      try {
        const contract = await factory.deploy(...deploymentArguments);
        const receipt = await contract.deployTransaction.wait();
        onDeploy(receipt)
      } catch (e) {
        console.error("Error deploying contract", e)
      }
    }
    setDeploying(false)
  }

  return (
    <div>
      <TWButton
        onClick={deployContract}
      >
      {deploying ? '* * *' : 'Deploy Contract'}
      </TWButton>
      <div className='text-xs'>
        You will be prompted to confirm the
        <br/> 
        transaction before anything happens.
      </div>
    </div>
  )

}

export default DeployContractButton;