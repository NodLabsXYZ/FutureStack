import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FutureStackLayout, TWCenteredContent, TWCircleSpinner } from '../components';
import { completeUserRegistration, supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'
import store from 'store2';

const publicRoutes = ['', 'login', 'register', 'arweave', 'uploader', 'error']
const dark = ['', 'login', 'register']

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();
  const surveyStore = store.namespace('survey')

  const rootPath = router.pathname.split('/')[1] || ''
  const publicRoute = publicRoutes.includes(rootPath);

  const [user, setUser] = useState()
  const [registeringUser, setRegisteringUser] = useState(false)
  const [darkMode, setDarkMode] = useState(dark.includes(rootPath))

  useEffect(() => {
    const _user = supabaseClient.auth.user()

    if (!_user && !publicRoute) {
      router.push('/')
      return;
    }

    const login = async (u) => {
      setUser(u)
      if (u) {
        setRegisteringUser(true)
        await completeUserRegistration(u)
        setRegisteringUser(false)
      } 

      setDarkMode(u === null && dark.includes(rootPath));
    }

    login(_user)
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
  }, [user, router, publicRoute, rootPath, surveyStore]);

  if (registeringUser) {
    return <TWCenteredContent>
      <div className='p-60'>
        <TWCircleSpinner />
      </div>
    </TWCenteredContent>
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

