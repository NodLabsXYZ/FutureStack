import { useEffect, useState } from 'react';

import { NextLink, TWCircleSpinner, TWButton } from "..";
import { getProject } from "../../lib/queries";

const Project = ({ id }) => {
  const [project, setProject] = useState();

  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      const project = await getProject(id);
      setProject(project)
    }

    loadProject()
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
      <div className='border p-6 mr-6'>
          <NextLink href={`/project/${id}/code`}>
            <TWButton>
              <a>Code</a>
            </TWButton>
          </NextLink>
        </div>
        <div className='border p-6 mr-6'>
          <NextLink href={`/project/${id}/contract`}>
            <TWButton>
              <a>Contracts</a>
            </TWButton>
          </NextLink>
        </div>
        <div className='border p-6 mr-6'>
          <NextLink href={`/project/${id}/asset`}>
            <TWButton>
              <a>Assets</a>
            </TWButton>
          </NextLink>
        </div>
      </div>
    </div>
  )
}

export default Project;