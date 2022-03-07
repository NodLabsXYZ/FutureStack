import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { getProject } from '../lib/queries';
import { TWCircleSpinner } from ".";

const ProjectLoader = ({ children }) => {
  const router = useRouter()
  const projectId = router.query.id 
  
  const [project, setProject] = useState()

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      const _project = await getProject(projectId)
      setProject(_project)
    }

    loadProject()
  }, [projectId])

  if (!project) {
    return (
      <TWCircleSpinner
        message='Loading project...'
      />
    )
  }

  const childrenWithProject = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { project });
    }
    return child;
  });

  return (
    <div>
      {childrenWithProject}
    </div>
  )
}

export default ProjectLoader;