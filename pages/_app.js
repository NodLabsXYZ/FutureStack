import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import store from 'store2';
import { AccountRegistration, FutureStackLayout } from '../components';
import { supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

const publicRoutes = ['', 'login', 'register', 'arweave', 'uploader', 'error']

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();

  const rootPath = router.pathname.split('/')[1] || ''
  const publicRoute = publicRoutes.includes(rootPath);

  const [user, setUser] = useState(supabaseClient.auth.user())

  const userStoreRef = useRef(store.namespace("user"));
  const [ready, setReady] = useState(!user || (userStoreRef.current('ready') || false));
 
  useEffect(() => {
    if (!user && !publicRoute) {
      router.push('/')
      return;
    } 
  }, [user, publicRoute, router])

  useEffect(() => {    
    const login = (_user) => {
      setUser(_user)

      if (_user && !userStoreRef.currrent('ready')) {
        setReady(false)
      }      
    }

    const { data, error } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          login(session.user)
        } else if (session === null) {
          login(null)
        }
      }
    );
    
    return data.unsubscribe;
  }, []);

  const onComplete = () => {
    userStoreRef.current('ready', true)
    setReady(true)
  }

  if (!ready && !user) {
    return <></>
  }

  return (
    <FutureStackLayout user={user}>
      {!ready && (
        <AccountRegistration 
          user={user} 
          onComplete={onComplete}
        />
      )}
      
      {ready && (
        <Component
          user={user}
          {...pageProps}
        />
      )}
    </FutureStackLayout>
  )
}

export default FutureStackApp;

