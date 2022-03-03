import {
  supabaseClient
} from '../lib'

import {
  FutureStackLayout,
  TWConstrainedCenteredContent,
  TWCircleSpinner,
  SupabaseMagicLink,
} from '.'

import { useEffect, useState } from 'react'
import { ProjectsDashboard } from './projects'

const FutureStack = ({  }) => {
  const [user, setUser] = useState()
  const [waiting, setWaiting] = useState({})

  useEffect(() => {
    const _user = supabaseClient.auth.user()
    if (_user) { 
      setUser(_user)
    } else {
      setTimeout(() => setWaiting(false), 1000)
    }

    supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (session === null) {
          setUser(null);
        }
      }
    );
  }, [user])

  if (!user) {
    return (
      <FutureStackLayout>
        <TWConstrainedCenteredContent>
          <div className='py-12'>
            {waiting &&
              <TWCircleSpinner />
            }
            {!waiting &&    
              <SupabaseMagicLink />
            }
          </div>
        </TWConstrainedCenteredContent>
      </FutureStackLayout>
    )
  }

  return (
    <FutureStackLayout user={user}>
      <ProjectsDashboard />
    </FutureStackLayout>
  )
}

export default FutureStack;