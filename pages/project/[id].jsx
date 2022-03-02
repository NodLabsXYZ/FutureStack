import {
  simpleApiCall
} from '../../lib'

import {
  ContractDeploymentDashboardTestLayout,
  TWCenteredContent,
  ConnectWalletButton,
  TWCircleSpinner,
  ContractDeploymentDashboardContract
} from '../../components'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

const ContractDeploymentDashboardProjectPage = () => {
  const router = useRouter()
  const [provider, setProvider] = useState()
  const [project, setProject] = useState()
  
  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    const getProject = async () => {
      const _project = await simpleApiCall(
        `projects/${id}`,
        'GET'
      )
      setProject(_project)
    }

    getProject()
  }, [router.query])
  
  return (
    <ContractDeploymentDashboardTestLayout>
      {!provider && 
        <TWCenteredContent>
          <div className='py-6'>
            <ConnectWalletButton
              onConnect={setProvider}
            />
          </div>
        </TWCenteredContent>
      }
      {provider && !project &&
        <TWCircleSpinner
          message="Loading project..."
        />
      }
      {provider && project &&
        <div>        
          <h2 className='text-lg'>
            <span className='font-bold mr-3'>
              Project:
            </span>
            {project.title}
          </h2>
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
    </ContractDeploymentDashboardTestLayout>
  )
}

export default ContractDeploymentDashboardProjectPage;