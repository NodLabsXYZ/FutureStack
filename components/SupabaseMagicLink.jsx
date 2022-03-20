import {
  supabaseClient
} from '../lib'

import {
  TWButton
} from '.'

// import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useState } from 'react';

const SupabaseMagicLink = () => {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState()
  const [email, setEmail] = useState('')

  const onClick = async () => {
    let { user, error } = await supabaseClient.auth.signIn({
      email: email
    })

    setError(error);
    if (!error) {
      setSent(true)
    }
  }

  return (
    <div>
      <p className='py-6'>
        Enter your email address and we&apos;ll send you a magic link to log in.
      </p>
      {error && 
        <div className='text-red-600 py-3'>
          {error.message}
        </div>
      }
      {sent &&
        <div className='py-3'>
          An email has been sent to the address you provided.
        </div>
      }
      <div>
        <h3 className='text-lg font-semibold mb-3'>
          Email
        </h3>
        <input
          type='text'
          className='border px-3 py-1 mb-3 w-full text-slate-900'
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          value={email}
        />
        <TWButton
          onClick={onClick}
        >
          Send Link
        </TWButton>
      </div>

    </div>
  )

}

export default SupabaseMagicLink;