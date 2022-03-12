import ReactMarkdown from 'react-markdown'

import {
  dateStringDiffToWords
} from '../../lib'

import {
  ContractDeployments,
  ContractConstructorForm,
  EthereumGasEstimateInformation,
  DeployContractButton
} from '.'

import {   
  ConnectWalletButton
} from '..'

import { useEffect, useMemo, useState } from 'react';
import { getContractDeployments, createContractDeployment } from '../../lib/queries';

const Contract = ({ project, contract }) => {
  const [provider, setProvider] = useState()
  const [deploymentArguments, setDeploymentArguments] = useState();
  const [deployments, setDeployments] = useState([]);
  
  const orderedArgumentValues = useMemo(() => {
    if (!deploymentArguments) return null;
    
    return deploymentArguments.map(
      (argument) => argument.value
    );
  }, [deploymentArguments]);

  useEffect(() => {
    const loadDeployments = async () => {
      const deployments = await getContractDeployments({
        projectId: project.id
      });
      setDeployments(deployments);
    }

    loadDeployments();
  }, [project])

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

    const deployment = {
      contract_id: contract.id,
      project_id: project.id,
      deployed_at: new Date().toISOString(),
      info: {
        network: chainId,
        deploymentArguments: deploymentArguments,
        ...receipt  
      }
    }

    const newDeployment = await createContractDeployment(deployment)
    newDeployment.contract = contract;

    setDeployments([newDeployment, ...deployments])
  }

  return (
    <div>
      <h2 className='text-lg font-bold mb-3'>
        {contract.name}
      </h2>
      <div className='text-xs mb-6'>
        <span className='font-semibold mr-1'>
          Last Compiled: 
        </span>
        {dateStringDiffToWords(contract.compiled_at)}
      </div>

      {deployments.length > 0 &&
        <div className='py-6'>
          <ContractDeployments
            provider={provider}
            deployments={deployments}
          />
        </div>
      }   

      <div className='py-6'>
        <h3 className='font-bold mb-3'>
          Contract Details
        </h3>  
        <div className='border p-3'>
          <div className='flex text-xs'>
            {contract.info?.description && 
              <div className=''>
                <h4 className='text-sm font-bold mb-3'>
                  Contract Description
                </h4>
                <div className='prose-sm scale-90 -translate-x-7 -translate-y-3'>
                  <ReactMarkdown>
                    {contract.info.description}
                  </ReactMarkdown>
                </div>
              </div>
            }
            <div className='pr-12'>
              <h2 className='text-sm font-bold mb-3'>
                Deployment Arguments
              </h2>
              <ContractConstructorForm  
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
                  <DeployContractButton
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
    </div>
  )

}

export default Contract;