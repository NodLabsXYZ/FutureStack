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

    const refreshUser = async () => {
      // supabaseClient.auth.refreshSession()
      // const session = supabaseClient.auth.session()
      // console.log("SESSION", session, "USER", _user)
      // const x = await supabaseClient.auth.signIn({
      //   refreshToken: session.refresh_token,
      // });
      // console.log("USER2", x);
      setUser(_user)
    }

    if (_user) { 
      refreshUser(_user)
    } else {
      setTimeout(() => setLoading(false), 1000)
    }

    const { data, error } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          console.log("USERCHANGE", event, session)
          setUser(session.user);
        } else if (session === null) {
          console.log("USERCHANGE SIGNEDOUT", event, session)
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

