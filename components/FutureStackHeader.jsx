import Image from 'next/image'

import {
  supabaseClient
} from '../lib'

import {
  NextLink,
  TWButton,
  TWCleanHeader
} from '.'
import { hideForUploaderInitialLaunch } from '../utils/featureFlags'

const FutureStackHeader = ({ user }) => {

  const signout = () => {
    supabaseClient.auth.signOut()
  }

  return (
    <TWCleanHeader>
      <h1 className='text-lg'>
        <NextLink href='/'>
          <a className='flex'>
            <Image
              src="/images/stack.png"
              alt="FutureStack Logo"
              width={24}
              height={18}
            />
            <div className='ml-1'>
              <span className='font-light'>Future</span>
              <span className='font-semibold'>Stack</span>
            </div>
          </a>
        </NextLink>
      </h1>
      {
        hideForUploaderInitialLaunch ? <></> :
        (
        <div className='-mt-2'>
          {user &&
            <span
              className='cursor-pointer'
              onClick={signout}
            >
              Sign Out
            </span>
          }
          {!user &&
            <TWButton
              classMap={{
                rounded: 'rounded-full'
              }}
            >
              <NextLink href='/login'>
                <a className='px-3 py-1'>
                  Sign In
                </a>
              </NextLink>
            </TWButton>
          }
        </div>
        )
      }
    </TWCleanHeader>
  )
}

export default FutureStackHeader;