import { useState } from 'react';
import {
  ethereumNetworkIdToName,
  dateStringDiffToWords,
  commify,
  bigNumberToEth,
  bigNumberFrom
} from '../../lib'

import {
  BoldTitleAndValue,
  ConnectWalletButton
} from '..'
import { ContractFunction } from '.';

// import { ethers } from 'ethers'
// import * as zksync from 'zksync';
// import { useEffect } from 'react';

const ContractDeployment = ({ deployment }) => {
  const { contract, info, deployed_at } = deployment;
  const { abi, contractAddress } = contract.info;
  const networkName = ethereumNetworkIdToName(info.network);
  const [provider, setProvider] = useState()

  // Experimenting with zksync
  // Need to `yarn add zksync` first
  // Try minting: https://docs.zksync.io/dev/nfts.html#mint
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

  const abiFunctions = () => {
    const functions = abi.filter((item) => item.type === 'function')
    
    return functions.map((method, index) => (
      <ContractFunction
        key={`abi-${index}`}
        provider={provider}
        info={method}
        chainId={info.network}
        address={info.contractAddress}
        abi={abi}
        index={index}
      />
    ))
  }
  
  const frontEndJs = () => {
    return JSON.stringify({
      "deployedAt": deployed_at,
      "address": contractAddress,
      "abi": abi,
      "network": info.network
    }, null, 2)
  }

  return (
    <div>
      <div className='flex justify-between'>
        <h2 className='font-bold mb-6'>{contract.name}</h2>
        {!provider && 
          <div className='mr-6'>
            <ConnectWalletButton
              onConnect={setProvider}
            />
          </div>
        }
      </div>
      <div 
        className='border p-3 mr-3'
      >
        <div className='font-bold'>
          {networkName}: 
          &nbsp;
          {dateStringDiffToWords(deployed_at)}
        </div>
        <div className='flex'>
          <div className='text-sm pt-3'>
            <a
              className='pt-3 text-blue-600 underline'
              href={`https://${networkName !== 'Mainnet' && `${networkName}.`}etherscan.io/address/${info.contractAddress}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Etherscan
            </a>
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

            <div className='pt-6'>
              <div className='font-bold'>
                Integrate With Front End
              </div>
              <p>
                Copy and paste the following code into contracts/contract.js in your project.
              </p>
              <textarea
                className='w-full h-64 text-sm bg-slate-200 p-3'
                value={frontEndJs()}
                readOnly
              />
            </div>
          </div>
          <div className='text-sm pl-6'>
            <div 
              className='font-bold'
            >
              Interact With Contract
            </div>
            
            {provider ? abiFunctions() : 
              <div className='py-6'>
                Please connect your wallet in order to interact with the contract.
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractDeployment;