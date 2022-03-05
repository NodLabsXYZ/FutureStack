import { useEffect, useState } from "react";
import { ContractPreview } from '.';
import { ContractDeploymentDashboardContract, TWCircleSpinner } from "..";
import { getContracts } from "../../lib/queries";
import { supabaseClient } from "../../lib";

const ContractsDashboard = ({ project }) => {
  const [provider, setProvider] = useState();
  const [contracts, setContracts] = useState();
  const [precompiledContracts, setPrecompiledContracts] = useState();
  const { access_token } = supabaseClient.auth.session() || {};

  useEffect(() => {
    const getPrecompiledContracts = async () => {
      const _contracts = await getContracts();
      setContracts(_contracts);

      const _precompiledProjects = await getContracts(true)
      setPrecompiledContracts(_precompiledProjects)
    }

    getPrecompiledContracts()
  }, [])

  return (
    <div>
      <h2 className='text-lg'>Contracts: {project.title}</h2>
      
      {(contracts || []).length === 0 && (
        <div className='text-sm'>
          <p>You have no custom contracts.</p>
          <p>You can upload any custom contract using the FutureStack CLI.</p>
          <p>After installing the CLI add a .env file with the following contents:</p>
          <code className='block my-3 bg-slate-700 text-white p-3 text-xs w-1/2 overflow-x-auto'>
            FUTURE_STACK_SECRET_KEY=&#39;{access_token}&#39;
          </code>
          <p>
            Then simply run 
            <code className='bg-slate-700 text-white px-1 py-1 mx-1 text-xs'>
              future compile -p &#39;{project.title}&#39;
            </code> 
            in any Hardhat project.
          </p>
        </div>
      )}
  
      {(contracts || []).length > 0 &&
        <div className='py-6'>
          <h2 className='font-bold'>Project Contracts</h2>
          <div className='flex'>
            {contracts.sort(
              (a, b) => new Date(b.compiledAt) - new Date(a.compiledAt)
            ).map(
              (contract, index) => (
                <div 
                  key={`contract-${index}`}
                  className='py-3'
                >
                  <ContractPreview
                    provider={provider}
                    contract={contract}
                  />
                </div>
              )
            )}
          </div>
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