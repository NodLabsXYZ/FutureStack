import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { FutureStackLayout, TWCircleSpinner } from "../../../../components"
import ContractsDashboard from "../../../../components/contracts/ContractsDashboard";
import { getProject } from '../../../../lib/queries';

const ContractsPage = () => {
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
    <ContractsDashboard 
      project={project}
    />
  )
}

export default ContractsPage;