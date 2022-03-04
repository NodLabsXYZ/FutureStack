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