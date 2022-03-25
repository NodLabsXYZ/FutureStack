import { useEffect, useState } from 'react';

import { NextLink, TWCircleSpinner, TWButton } from "..";
import { checkFeatureFlag } from '../../lib';
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

  const button = (href, label) => (
    <TWButton classMap={{ padding: 'p-0 '}}>
      <NextLink href={href}>
        <a className='block px-3 py-1'>{label}</a>
      </NextLink>
    </TWButton>
  )

  return (
    <div>     
      <h2 className='text-lg'>
        <span className='font-bold mr-3'>
          Project:
        </span>
        {project.title}
      </h2>
      <div className='flex pt-6'>
        {checkFeatureFlag('full-project') && (
          <>
            <div className='border p-6 mr-6'>
              {button(`/project/${id}/code`, 'Code')}
            </div>
            <div className='border p-6 mr-6'>
              {button(`/project/${id}/contract`, 'Contracts')}
            </div>
          </>
        )}
        <div className='border p-6 mr-6'>
          {button(`/project/${id}/asset`, 'Assets')}
        </div>
      </div>
    </div>
  )
}

export default Project;