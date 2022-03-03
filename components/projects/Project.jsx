import { useEffect, useState } from 'react';

import { NextLink, TWCircleSpinner, TWButton } from "..";
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
      <div className='flex pt-6'>
        <div className='border p-6'>
          <TWButton>
            <NextLink href={`/project/${id}/contract`}>
              <a>Contracts</a>
            </NextLink>
          </TWButton>
        </div>
      </div>
    </div>
  )
}

export default Project;