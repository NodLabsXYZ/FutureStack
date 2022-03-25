import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import { FutureStackLayout, TWCenteredContent, TWCircleSpinner } from '../components';
import { completeUserRegistration, supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

const publicRoutes = ['', 'login', 'register', 'arweave', 'uploader', 'error']
const dark = ['', 'login', 'register']

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();

  const rootPath = router.pathname.split('/')[1] || ''
  const publicRoute = publicRoutes.includes(rootPath);

  const [ready, setReady] = useState(false);
 
  const [user, setUser] = useState(supabaseClient.auth.user())
  const [darkMode, setDarkMode] = useState(!user && dark.includes(rootPath))
  const registeringUserId = useRef()

  useEffect(() => {
    const _user = supabaseClient.auth.user()
    setDarkMode(!_user && dark.includes(rootPath));

    if (!_user && !publicRoute) {
      router.push('/')
      return;
    }  

    const login = async (u) => {
      setReady(false)
      if (u?.id !== user?.id) {
        setDarkMode(!u && dark.includes(rootPath));
        setUser(u)
      }

      if (!u) return;

      if (registeringUserId.current === u.id) return;
      registeringUserId.current = u.id
      const success = await completeUserRegistration(u)
      registeringUserId.current = null

      if (success) {
        setReady(true)
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
    
    if (_user) {
      login(_user)
    } else {
      setReady(true)
    }

    return data.unsubscribe;
  }, [user, rootPath, publicRoute, router]);

  if (!ready) {
    return (
      <TWCenteredContent>
        <div className='p-60'>
          <TWCircleSpinner />
        </div>
      </TWCenteredContent>
    )
  }

  return (
    <FutureStackLayout darkMode={darkMode} user={user}>
      <Component
        user={user}
        {...pageProps}
      />
    </FutureStackLayout>
  )
}

export default FutureStackApp;

