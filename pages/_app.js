import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FutureStackLayout } from '../components';
import { supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

const publicRoutes = ['', 'login', 'arweave', 'uploader', 'error']

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState()
  const publicRoute = publicRoutes.includes(router.pathname.split('/')[1] || '');

  useEffect(() => {
    const _user = supabaseClient.auth.user()

    if (!_user && !publicRoute) {
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
  }, [user, router, publicRoute])

  return (
    <FutureStackLayout publicRoute={publicRoute} user={user}>
      <Component
        user={user}
        {...pageProps}
      />
    </FutureStackLayout>
  )
}

export default FutureStackApp;

