import {
  supabaseClient
} from '../lib'

import {
  TWCleanHeader
} from '.'

const FutureStackHeader = ({ user }) => {

  const signout = () => {
    supabaseClient.auth.signOut()
  }

  return (
    <TWCleanHeader>
      <h1 className='text-md'>
        FutureStack
      </h1>
      <div>
        {user && 
          <span
            className='cursor-pointer'
            onClick={signout}
          >
            Sign Out
          </span>
        }
      </div>
    </TWCleanHeader>
  )
}

export default FutureStackHeader;