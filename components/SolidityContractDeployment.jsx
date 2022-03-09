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

// import { ethers } from 'ethers'
// import * as zksync from 'zksync';
// import { useEffect } from 'react';

const SolidityContractDeployment = ({ provider, contract, deployment }) => {
  const { info, deployed_at } = deployment;
  const { abi } = contract.info;

  // Experimenting with zksync
  // Need to `yarn add zksync` first
  // useEffect(() => {
  //   if (!provider) return;

  //   const tryzksync = async () => {
  //     const syncProvider = await zksync.getDefaultProvider('rinkeby');
  //     const ethWallet = provider.getSigner()

  //     const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);

  //     const ethersContract = new ethers.Contract(info.contractAddress, abi, provider)     
      
  //     const { totalFee: fee } = await syncProvider.getTransactionFee('MintNFT', syncWallet.address(), feeToken);

  //     const connected = ethersContract.connect(syncWallet)
  //     const tx = await connected['mint'](
  //       "HI", 
  //       { value: "100000000000000000" }
  //     )
  //     //0.10031586ETH
  //     if (tx.wait) {
  //       const receipt = await tx.wait()
  //       setResponse(receipt)
  //     } else {
  //       setResponse(tx)
  //     }    

  //     console.log(syncWallet, zksync);
  //   }

  //   tryzksync();
  // }, [provider, info, contract])

  return (
    <div 
      className='border p-3 mr-3 text-sm'
    >
      <div className='font-bold'>
        {ethereumNetworkIdToName(info.network)}: 
        &nbsp;
        {dateStringDiffToWords(deployed_at)}
      </div>
      <div className='text-xs pt-3'>
        <BoldTitleAndValue
          title="Address"
          value={info.contractAddress}
        />
        <BoldTitleAndValue
          title="Gas Used"
          value={commify(info.gasUsed)}
        />
        <BoldTitleAndValue
          title="Cost"
          value={`${bigNumberToEth(
            bigNumberFrom(info.effectiveGasPrice).mul(
              bigNumberFrom(info.gasUsed)
            )
          )} ETH`}
        />
        <BoldTitleAndValue
          title="Arguments"
          value={(
            <div className='pl-3'>
              {info.deploymentArguments.map(
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