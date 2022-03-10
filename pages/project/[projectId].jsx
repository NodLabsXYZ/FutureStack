import { useRouter } from 'next/router'
import { Project } from '../../components/projects';

const ProjectPage = () => {
  const router = useRouter()
  const { projectId } = router.query
  
  return (
    <Project id={projectId} />
  )
}

export default ProjectPage;