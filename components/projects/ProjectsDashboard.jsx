import { useEffect, useState } from 'react';
import store from 'store2';
import { NewProjectButton, ProjectListing } from '.';
import { TWCircleSpinner } from '..';
import { getProjects } from '../../lib/queries';

const ContractDeploymentDashboardProjects = () => {
  const [projects, setProjects] = useState()

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await getProjects()
      setProjects(projects)
    }

    loadProjects()
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
                <div key={`project-${index}`} className='mr-3'>
                  <ProjectListing
                    project={project}
                  />
                </div>
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