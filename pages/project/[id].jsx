import { useRouter } from 'next/router'
import { Project } from '../../components/projects';

const ProjectPage = () => {
  const router = useRouter()
  const { id } = router.query
  
  return (
    <Project id={id} />
  )
}

export default ProjectPage;