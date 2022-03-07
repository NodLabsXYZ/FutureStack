import ReactMarkdown from 'react-markdown'

import {
  simpleApiCall,
  dateStringDiffToWords
} from '../../lib'

import {
  SolidityContractDeployments,
  SolidityContractConstructorForm,
  EthereumGasEstimateInformation,
  DeploySolidityContractButton,
  ConnectWalletButton
} from '..'

import { useMemo, useState } from 'react';

const Contract = ({ contract }) => {
  const [provider, setProvider] = useState()
  const [deploymentArguments, setDeploymentArguments] = useState();
  const [activeContract, setActiveContract] = useState(contract);
  
  const orderedArgumentValues = useMemo(() => {
    if (!deploymentArguments) return null;
    
    return deploymentArguments.map(
      (argument) => argument.value
    );
  }, [deploymentArguments]);

  const onArgsChange = (args) => {
    if (!args) {
      if (deploymentArguments) {
        setDeploymentArguments(args)
      }
      return;
    }

    const newArg = args.find(
      (arg, index) => ((deploymentArguments || [])[index]?.value !== arg.value)
    ) 
    if (newArg) {
      setDeploymentArguments(args);
    }
  }

  const onDeploy = async (receipt) => {
    const { chainId } = await provider.getNetwork()

    const updatedContract = {
      ...contract,
      info: {
        ...contract.info,
        deployments: [
          ...(contract.info.deployments || []),
          {
            network: chainId,
            deployedAt: Date.now(),
            deploymentArguments: deploymentArguments,
            ...receipt,
          }
        ]
      }
    }

    setActiveContract(updatedContract)

    const { json, status } = await simpleApiCall(
      `contracts/${contract.id}`,
      'POST',
      updatedContract
    )

    setActiveContract(json)
  }

  return (
    <div>
      <div className='border p-3'>
        <h3 className='font-bold mb-3'>
          {contract.name}
        </h3>
        <div className='text-xs mb-6'>
          <span className='font-semibold mr-1'>
            Compiled: 
          </span>
          {dateStringDiffToWords(contract.compiled_at + 'Z')}
        </div>
        <div className='flex text-xs'>
          {activeContract.info?.description && 
            <div className=''>
              <h2 className='text-sm font-bold mb-3'>
                Contract Description
              </h2>
              <div className='prose-sm scale-90 -translate-x-7 -translate-y-3'>
                <ReactMarkdown>
                  {activeContract.info.description}
                </ReactMarkdown>
              </div>
            </div>
          }
          {activeContract.info?.deployments &&
            <div className='pr-12 text-sm'>
              <SolidityContractDeployments
                deployments={activeContract.info.deployments}
              />
            </div>
          }   
          <div className='pr-12'>
            <h2 className='text-sm font-bold mb-3'>
              Deployment Arguments
            </h2>
            <SolidityContractConstructorForm  
              abi={contract.info.abi}
              onChange={onArgsChange}
            />
          </div>
          <div>
            <h2 className='text-sm font-bold mb-3'>
              Deploy Contract
            </h2>
            <EthereumGasEstimateInformation
              provider={provider}
              contract={contract}
              deploymentArguments={orderedArgumentValues}
            />
            {!provider && 
              <div className=''>
                <ConnectWalletButton
                  onConnect={setProvider}
                />
              </div>
            }
            {provider && deploymentArguments && (
              <div className='mt-6'>
                <DeploySolidityContractButton
                  provider={provider}
                  abi={contract.info.abi}
                  bytecode={contract.info.bytecode}
                  deploymentArguments={orderedArgumentValues}
                  onDeploy={onDeploy}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  )

}

export default Contract;