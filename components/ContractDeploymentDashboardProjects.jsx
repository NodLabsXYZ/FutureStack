import {
  simpleApiCall
} from '../lib'

import {
  TWCircleSpinner,
  ContractDeploymentDashboardProject,
  ContractDeploymentDashboardProjectsNewButton,
  ContractDeploymentDashboardProjectsCreateButton
} from '.'

import { useEffect, useState } from 'react';

const ContractDeploymentDashboardProjects = () => {
  const [projects, setProjects] = useState()

  useEffect(() => {
    const getProjects = async () => {
      const _projects = await simpleApiCall(
        'projects',
        'GET'
      )
      setProjects(_projects)
    }

    getProjects()
  }, [])

  return (
    <div className=''>
      <h2 className='text-lg mb-3'>Projects</h2>
      <div className='p-3 border border-slate-800'>
        {!projects &&
          <TWCircleSpinner
            message="Loading projects..."
          />
        }
        {projects && 
          <div className='flex mb-3'>
            {projects.map(
              (project, index) => (
                <ContractDeploymentDashboardProject
                  key={`project-${index}`}
                  project={project}
                />
              )
            )}
          </div>
        }
        <ContractDeploymentDashboardProjectsNewButton />
        &nbsp;
        <ContractDeploymentDashboardProjectsCreateButton />
      </div>
    </div>
  )
}

export default ContractDeploymentDashboardProjects;