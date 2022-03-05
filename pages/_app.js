import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FutureStackLayout } from '../components';
import { supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const _user = supabaseClient.auth.user()

    if (!_user) { 
      if (router.pathname !== '/') {
        router.push('/')
        return;
      }
      
      setTimeout(() => setLoading(false), 1000)
    }

    setUser(_user)

    const { data, error } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (session === null) {
          setUser(null);
        }
      }
    );

    return data.unsubscribe;
  }, [user, router])

  return (
    <FutureStackLayout user={user}>
      <Component 
        loading={loading} 
        user={user} 
        {...pageProps} 
      />
    </FutureStackLayout>
  )
}

export default FutureStackApp;

