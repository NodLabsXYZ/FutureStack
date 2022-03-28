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
  const userStore = store.namespace("user")

  const rootPath = router.pathname.split('/')[1] || ''
  const publicRoute = publicRoutes.includes(rootPath);

  const [userStatus, setUserStatus] = useState({
    user: supabaseClient.auth.user(),
    ready: supabaseClient.auth.user() == null
  })
 
  useEffect(() => {
    if (!userStatus.user && !publicRoute) {
      router.push('/')
      return;
    }
  }, [userStatus, publicRoute, router])

  useEffect(() => {   
    const { data, error } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUserStatus({
            user: session.user,
            ready: false
          })
        } else if (session === null) {
          setUserStatus({
            user: null,
            ready: true
          })
        }
      }
    );
    
    return data.unsubscribe;
  }, []);

  const onComplete = () => {
    userStore('ready', true)
    setUserStatus({
      user: userStatus.user,
      ready: true      
    })
  }

  return (
    <FutureStackLayout user={userStatus.user}>
      {!userStatus.ready && (
        <AccountRegistration 
          user={userStatus.user} 
          onComplete={onComplete}
        />
      )}
      
      {userStatus.ready && (
        <Component
          user={userStatus.user}
          {...pageProps}
        />
      )}
    </FutureStackLayout>
  )
}

export default FutureStackApp;

