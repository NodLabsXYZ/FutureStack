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

  const [user, setUser] = useState(supabaseClient.auth.user())
  const [registeringUser, setRegisteringUser] = useState(true)
  const [darkMode, setDarkMode] = useState(dark.includes(rootPath))

  useEffect(() => {
    const login = async (_user) => {
      await completeUserRegistration(_user)
      setDarkMode(_user === null && dark.includes(rootPath));
      setRegisteringUser(false)
      setUser(_user)
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

    login(user)

    return data.unsubscribe;
  }, [user, rootPath]);

  if (!user && !publicRoute) {
    router.push('/')
    return <></>;
  }

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

