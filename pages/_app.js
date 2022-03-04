import { useEffect, useState } from 'react';
import { FutureStackLayout } from '../components';
import { supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

function FutureStackApp({ Component, pageProps }) {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const _user = supabaseClient.auth.user()
    setUser(_user)

    if (!_user) { 
      setTimeout(() => setLoading(false), 1000)
    }

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
  }, [user])

  return (
    <FutureStackLayout>
      <Component 
        loading={loading} 
        user={user} 
        {...pageProps} 
      />
    </FutureStackLayout>
  )
}

export default FutureStackApp;

