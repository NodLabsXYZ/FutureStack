import { useEffect, useState } from "react";
import { ContractPreview } from '.';
import { TWCircleSpinner } from "..";
import { getContracts } from "../../lib/queries";
import { supabaseClient } from "../../lib";

const ContractsDashboard = ({ project }) => {
  const [contracts, setContracts] = useState();
  const [showCustomContractInstructions, setShowCustomContractInstructions] = useState(false);
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

      <div className='py-6'>
        <h2 className='font-bold'>Deployed Contracts</h2>
        <p className='text-sm pt-3'>You have not yet deployed any contracts.</p>
      </div>


      <div className='py-6'>
        <h2 className='font-bold'>Project Contracts</h2>
        {(contracts || []).length > 0 &&
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
                    contract={contract}
                  />
                </div>
              )
            )}
          </div>
        }
        {(contracts || []).length === 0 && (
          <div className='text-sm'>
            <p className='pt-3'>You have not uploaded any custom contracts for your project.</p>
            <div 
              className='pt-3 px-3 text-slate-700 cursor-pointer'
              onClick={() => setShowCustomContractInstructions(!showCustomContractInstructions)}
            >
              {showCustomContractInstructions ? <>&#8897;</> : <>&#62;</>} Custom Contract Instructions
            </div>
            {showCustomContractInstructions &&
              <div className='pt-3'>
                <p className='pt-3'>
                  You can upload any contract using the 
                  <a 
                    href='https://www.npmjs.com/package/futurestack-cli' 
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-1 text-blue-600 underline'
                  >
                    FutureStack CLI.
                  </a>
                </p>
                <p className='pt-3'>After installing the CLI add a .env file with the following contents:</p>
                <code className='block my-3 bg-slate-700 text-white p-3 text-xs w-1/2 overflow-x-auto'>
                  FUTURE_STACK_SECRET_KEY=&#39;{access_token}&#39;
                </code>
                <p>
                  Be sure to add the .env file to your .gitignore so that you do not accidentally commit it.
                </p>
                <p className='pt-3'>
                  Then simply run 
                  <code className='bg-slate-700 text-white px-1 py-1 mx-1 text-xs'>
                    npx future compile -p &#39;{project.title}&#39;
                  </code> 
                  in any Hardhat project.
                </p>
                <p className='pt-3'>
                  This command will compile the contract and upload the ABI and bytecode so you can 
                  <br/>
                  easily deploy and track the contract from this dashboard using your browser-based wallet.
                </p> 
              </div>
            }
          </div>
        )}
      </div>
  
      {!precompiledContracts &&
        <TWCircleSpinner
          message='Loading precompiled contracts...'
        />
      }

      {precompiledContracts &&
        <div className='py-6'>
          <h2 className='font-semibold'>Precompiled Contracts</h2>
          <div className='flex'>
            {precompiledContracts.map(
              (contract, index) => (
                <div
                  key={`precompiled-contract-${index}`}
                  className='py-3'
                >
                  <ContractPreview
                    contract={contract}
                  />
                </div>
              )
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default ContractsDashboard;