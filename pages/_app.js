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

  const [user, setUser] = useState(supabaseClient.auth.user())
  const [ready, setReady] = useState(user !== null);
 

  useEffect(() => {
    if (!user && !publicRoute) {
      router.push('/')
      return;
    }  

    const { data, error } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
          setReady(false)
        } else if (session === null) {
          setUser(null)
        }
      }
    );
    
    return data.unsubscribe;
  }, [user, rootPath, publicRoute, router]);

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

