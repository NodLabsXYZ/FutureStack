import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { getProject } from '../../../../lib/queries';
import { TWCircleSpinner } from "../../../../components";
import { AssetDashboard } from "../../../../components/uploader";

const AssetPage = () => {
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

  return (
    <AssetDashboard
      project={project}
    />
  );
}

export default AssetPage;