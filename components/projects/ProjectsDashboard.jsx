import {
  simpleApiCall
} from '../../lib'

import { useEffect, useState } from 'react';
import { TWCircleSpinner } from '..';
import { NewProjectButton, ProjectListing } from '.';

const ContractDeploymentDashboardProjects = () => {
  const [projects, setProjects] = useState()

  useEffect(() => {
    const getProjects = async () => {
      const { data, error } = await simpleApiCall(
        'projects',
        'GET'
      )
      setProjects(data)
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
                <ProjectListing
                  key={`project-${index}`}
                  project={project}
                />
              )
            )}
          </div>
        }

        <div className='pt-6'>
          <NewProjectButton />
        </div>
      </div>
    </div>
  )
}

export default ContractDeploymentDashboardProjects;