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
    const login = async (_user) => {
      setReady(false)
      if (_user?.id !== user?.id) {
        setDarkMode(!_user && dark.includes(rootPath));
        setUser(_user)
      }

      if (!_user) return;
      if (registeringUserId.current === _user.id) return;

      registeringUserId.current = _user.id
      const success = await completeUserRegistration(_user)
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
    
    if (user) {
      login(user)
    } else {
      setReady(true)
    }

    return data.unsubscribe;
  }, [user, rootPath]);

  if (!user && !publicRoute) {
    router.push('/')
    return;
  }

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

