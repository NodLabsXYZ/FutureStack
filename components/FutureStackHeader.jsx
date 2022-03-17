import Image from 'next/image'

import {
  supabaseClient
} from '../lib'

import {
  NextLink,
  TWButton,
  TWCleanHeader
} from '.'

const FutureStackHeader = ({ publicRoute, user }) => {

  const signout = () => {
    supabaseClient.auth.signOut()
  }

  return (
    <TWCleanHeader>
      <h1 className='text-lg'>
        <NextLink href='/'>
          <a className='flex'>
            <Image
              src="/images/white-stack.png"
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
          <NextLink href='/login'>
            <a className='mr-6 font-light'>
              Sign In
            </a>
          </NextLink>
        }
        <TWButton
            classMap={{
              rounded: 'rounded-full',
              background: 'bg-white',
              padding: 'px-1',
              font: 'font-light text-slate-900',
            }}
          >
            <NextLink href='/login'>
              <a className='px-3 py-1'>
                Request Access
              </a>
            </NextLink>
          </TWButton>
      </div>
    </TWCleanHeader>
  )
}

export default FutureStackHeader;