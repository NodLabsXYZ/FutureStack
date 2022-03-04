import {
  supabaseClient
} from '../lib'

import {
  TWConstrainedCenteredContent,
  TWCircleSpinner,
  SupabaseMagicLink,
} from '.'

// import { useEffect, useState } from 'react'
import { ProjectsDashboard } from './projects'

const FutureStack = ({ loading, user  }) => {
  // const [user, setUser] = useState()
  // const [waiting, setWaiting] = useState({})

  // useEffect(() => {
  //   const _user = supabaseClient.auth.user()
  //   if (_user) { 
  //     setUser(_user)
  //   } else {
  //     setTimeout(() => setWaiting(false), 1000)
  //   }

  //   supabaseClient.auth.onAuthStateChange(
  //     (event, session) => {
  //       if (event === 'SIGNED_IN' && session) {
  //         setUser(session.user);
  //       } else if (session === null) {
  //         setUser(null);
  //       }
  //     }
  //   );
  // }, [user])

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