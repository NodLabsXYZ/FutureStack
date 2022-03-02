import {
  supabaseClient
} from '../lib'

import {
  ContractDeploymentDashboardTestLayout,
  TWConstrainedCenteredContent,
  TWCircleSpinner,
  SupabaseMagicLink,
  ContractDeploymentDashboardProjects
} from '.'

import { useEffect, useState } from 'react'

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
  }, [])

  if (!user) {
    return (
      <ContractDeploymentDashboardTestLayout>
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
      </ContractDeploymentDashboardTestLayout>
    )
  }

  return (
    <ContractDeploymentDashboardTestLayout>
      <ContractDeploymentDashboardProjects />
    </ContractDeploymentDashboardTestLayout>
  )
}

export default FutureStack;