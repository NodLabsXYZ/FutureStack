import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FutureStackLayout } from '../components';
import { supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

const publicRoutes = ['', 'login', 'arweave']

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState()

  useEffect(() => {
    console.log("REFERRER", document.referrer)
    const _user = supabaseClient.auth.user()

    if (!_user && !publicRoutes.includes(router.pathname.split('/')[1] || '')) { 
      router.push('/')
      return;
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
        user={user} 
        {...pageProps} 
      />
    </FutureStackLayout>
  )
}

export default FutureStackApp;

