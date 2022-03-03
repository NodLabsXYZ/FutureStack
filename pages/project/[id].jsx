import {
  FutureStackLayout
} from '../../components'

import { useRouter } from 'next/router'
import { Project } from '../../components/projects';

const ProjectPage = () => {
  const router = useRouter()
  const { id } = router.query
  
  return (
    <FutureStackLayout>
      <Project id={id} />
    </FutureStackLayout>
  )
}

export default ProjectPage;