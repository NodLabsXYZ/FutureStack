import FrontPage from './FrontPage'

import { ProjectsDashboard } from './projects'

const FutureStack = ({ user }) => {
  if (!user) {
    return (
      <FrontPage />
    )
  }
  
  return (
    <ProjectsDashboard />
  )
}

export default FutureStack;