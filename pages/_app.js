import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import { AccountRegistration, FutureStackLayout, TWCenteredContent, TWCircleSpinner } from '../components';
import { completeUserRegistration, supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

const publicRoutes = ['', 'login', 'register', 'arweave', 'uploader', 'error']

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();

  const rootPath = router.pathname.split('/')[1] || ''
  const publicRoute = publicRoutes.includes(rootPath);

  const [user, setUser] = useState()
  const [ready, setReady] = useState(false);
 
  useEffect(() => {
    if (!user && !publicRoute) {
      router.push('/')
      return;
    } 
    
    const login = (_user) => {
      setUser(_user)
      setReady(!_user)
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

    login(supabaseClient.auth.user())
    
    return data.unsubscribe;
  }, [user, rootPath, publicRoute, router]);

  if (!ready && !user) {
    return <></>
  }

  return (
    <FutureStackLayout user={user}>
      {!ready && (
        <AccountRegistration 
          user={user} 
          onComplete={() => setReady(true)}
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

