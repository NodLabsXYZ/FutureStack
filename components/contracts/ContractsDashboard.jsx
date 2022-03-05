import { useEffect, useState } from "react";
import { ContractDeploymentDashboardContract, TWCircleSpinner } from "..";
import { getContracts } from "../../lib/queries";
import { supabaseClient } from "../../lib";

const ContractsDashboard = ({ project }) => {
  const [precompiledContracts, setPrecompiledContracts] = useState();

  useEffect(() => {
    const getPrecompiledContracts = async () => {
      const user = supabaseClient.auth.user();

      let team = await supabaseClient
        .from('team')
        .select('*, profile!inner(*)')
        .eq('profile.user_id', user.id)
        .maybeSingle();

      console.log("TEAM", team);

      const _precompiledProjects = await getContracts(true)

      setPrecompiledContracts(_precompiledProjects)
    }

    getPrecompiledContracts()
  }, [])

  return (
    <div>
      <h2 className='text-lg'>My Contracts</h2>
      
      {(project.contract || []).length === 0 && (
        <div>
          <p>You have no custom contracts.</p>
          <p>You can upload any custom contract using the FutureStack CLI.</p>
          <p>
            Simply run 
            <code className='bg-slate-700 text-white px-1 mx-1'>future compile</code> 
            in any Hardhat project.
          </p>
        </div>
      )}
  
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