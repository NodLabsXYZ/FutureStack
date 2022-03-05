import Image from 'next/image'

import {
  supabaseClient
} from '../lib'

import {
  NextLink,
  TWCleanHeader
} from '.'

const FutureStackHeader = ({ user }) => {

  const signout = () => {
    supabaseClient.auth.signOut()
  }

  return (
    <TWCleanHeader>
      <h1 className='text-lg' style={{ lineHeight: '21px' }}>
        <NextLink href='/'>
          <a>
            <Image
              src="/images/stack.png"
              alt="FutureStack Logo"
              width={21}
              height={21}
            />
            <span className='ml-1 align-top'>
              Future<span className='font-semibold'>Stack</span>
            </span>
          </a>
        </NextLink>
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