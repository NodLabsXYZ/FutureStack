import { useEffect, useState } from "react";
import { ContractDeploymentDashboardContract, TWCircleSpinner } from "..";
import { simpleApiCall } from "../../lib";

const ContractsDashboard = ({ project }) => {
  const [precompiledContracts, setPrecompiledContracts] = useState();

  useEffect(() => {
    const getPrecompiledContracts = async () => {
      const { json, error } = await simpleApiCall(
        'contracts/public',
        'GET'
      )

      setPrecompiledContracts(json)
    }

    getPrecompiledContracts()
  })

  return (
    <div>
      <h2 className='text-lg'>Contracts</h2>
      
      {(project.contract || []).length > 0 &&
        <div className='py-6'>
          <h2 className='font-bold'>Project Contracts</h2>
          {project.contracts.sort(
            (a, b) => new Date(b.compiledAt) - new Date(a.compiledAt)
          ).map(
            (contract, index) => (
              <div 
                key={`contract-${index}`}
                className='py-3'
              >
                <ContractDeploymentDashboardContract
                  provider={provider}
                  contract={contract}
                />
              </div>
            )
          )}
        </div>
      }

      {!precompiledContracts &&
        <TWCircleSpinner
          message='Loading precompiled contracts...'
        />
      }

      {precompiledContracts &&
        <div className='py-6'>
          <h2 className='font-bold'>Precompiled Contracts</h2>
          {precompiledContracts.map(
            (contract, index) => (
              <div
                key={`precompiled-contract-${index}`}
                className='py-3'
              >
                <ContractDeploymentDashboardContract
                  provider={provider}
                  contract={contract}
                />
              </div>
            )
          )}
        </div>
      }
    </div>
  )
}

export default ContractsDashboard;