import { useEffect, useState } from 'react';

import { ContractDeploymentDashboardContract, TWCircleSpinner } from "..";
import { simpleApiCall } from "../../lib";

const Project = ({ id }) => {
  const [project, setProject] = useState();

  useEffect(() => {
    if (!id) return;

    const getProject = async () => {
      const { json, error } = await simpleApiCall(
        `projects/${id}`,
        'GET'
      )
      setProject(json)
    }

    getProject()
  }, [id])

  if (!project) {
    return (
      <TWCircleSpinner
        message="Loading project..."
      />
    )
  }

  return (
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
  )
}

export default Project;