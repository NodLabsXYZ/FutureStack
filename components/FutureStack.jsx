import {
  TWConstrainedCenteredContent,
  TWCircleSpinner,
  SupabaseMagicLink,
} from '.'

import { ProjectsDashboard } from './projects'

const FutureStack = ({ loading, user  }) => {
  if (!user) {
    return (
      <TWConstrainedCenteredContent>
        <div className='py-12'>
          {loading &&
            <TWCircleSpinner />
          }
          {!loading &&    
            <SupabaseMagicLink />
          }
        </div>
      </TWConstrainedCenteredContent>
    )
  }

  return (
    <ProjectsDashboard />
  )
}

export default FutureStack;