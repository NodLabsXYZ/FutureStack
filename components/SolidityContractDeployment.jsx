import {
  ethereumNetworkIdToName,
  dateStringDiffToWords,
  commify,
  bigNumberToEth,
  bigNumberFrom
} from '../lib'

import {
  BoldTitleAndValue
} from '.'

import { ethers } from 'ethers'
import * as zksync from 'zksync';
import { useEffect } from 'react';

const SolidityContractDeployment = ({ provider, deployment }) => {
  
  useEffect(() => {
    const tryzksync = async () => {
      const syncProvider = await zksync.getDefaultProvider('rinkeby');
      const ethWallet = provider.getSigner()

      const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);

      const contract = new ethers.Contract(address, abi, provider)                
      const signer = provider.getSigner()
      const connected = contract.connect(signer)
      const tx = await connected[name](...inputValues.current)
      if (tx.wait) {
        const receipt = await tx.wait()
        setResponse(receipt)
      } else {
        setResponse(tx)
      }    

      console.log(syncWallet, zksync);
    }

    tryzksync();
  }, [])

  return (
    <div 
      className='border p-3 mr-3 text-sm'
    >
      <div className='font-bold'>
        {ethereumNetworkIdToName(deployment.network)}: 
        &nbsp;
        {dateStringDiffToWords(deployment.deployedAt)}
      </div>
      <div className='text-xs pt-3'>
        <BoldTitleAndValue
          title="Address"
          value={deployment.contractAddress}
        />
        <BoldTitleAndValue
          title="Gas Used"
          value={commify(deployment.gasUsed)}
        />
        <BoldTitleAndValue
          title="Cost"
          value={`${bigNumberToEth(
            bigNumberFrom(deployment.effectiveGasPrice).mul(
              bigNumberFrom(deployment.gasUsed)
            )
          )} ETH`}
        />
        <BoldTitleAndValue
          title="Arguments"
          value={(
            <div className='pl-3'>
              {deployment.deploymentArguments.map(
                (arg, argIndex) => (
                  <BoldTitleAndValue
                    key={`deployment-arg-${deployment.id}-${argIndex}`}
                    title={arg.name || argIndex + 1}
                    value={arg.value || arg}
                  />
                )
              )}
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default SolidityContractDeployment;