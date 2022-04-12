import Image from 'next/image'

import {
  supabaseClient
} from '../lib'

import {
  NextLink,
  TWButton,
  TWCleanHeader
} from '.'
import store from 'store2'
import { useRouter } from 'next/router'

const FutureStackHeader = ({ darkMode=false, user }) => {
  const router = useRouter()
  const userStore = store.namespace("user");
  const profile = userStore("profile")

  const signout = () => {
    supabaseClient.auth.signOut()
    store.clear();
  }

  return (
    <TWCleanHeader classMap={{fontColor: darkMode ? 'text-white' : 'text-slate-900'}}>
      <h1 className='text-lg'>
        <div className='flex cursor-pointer' onClick={() => router.push('/')}>
          <Image
            src={`/images/${darkMode ? 'white-' : ''}stack.png`}
            alt="FutureStack Logo"
            width={24}
            height={18}
          />
          <div className='ml-1'>
            <span className='font-light'>Future</span>
            <span className='font-semibold'>Stack</span>
          </div>
        </div>
      </h1>
      <div className='-mt-2 flex'>
        {user &&
          <>
            <div className='mr-12'>
              Account:
              ${(profile?.stored_value || 0) / 100}
            </div>
            <div
              className='cursor-pointer'
              onClick={signout}
            >
              Sign Out
            </div>
          </>
        }
        {!user &&
          <>
            <NextLink href='/login'>
              <a className='mr-6 font-light'>
                Sign In
              </a>
            </NextLink>
            <TWButton
              classMap={{
                rounded: 'rounded-full',
                background: darkMode ? 'bg-white' : 'bg-slate-900',
                padding: 'px-1',
                font: 'font-light',
              }}
            >
              <NextLink href='/register'>
                <a className={`px-3 py-1 ${darkMode ? 'text-slate-900' : 'text-white'}`}>
                  Register
                </a>
              </NextLink>
            </TWButton>
          </>
        }
      </div>
    </TWCleanHeader>
  )
}

export default FutureStackHeader;