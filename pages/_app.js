import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FutureStackLayout } from '../components';
import { supabaseClient } from '../lib';
import '../styles/globals.css'
import '../styles/index.css'

const publicRoutes = ['', 'login', 'register', 'arweave', 'uploader', 'error']
const dark = ['', 'login', 'register']

function FutureStackApp({ Component, pageProps }) {
  const router = useRouter();

  const rootPath = router.pathname.split('/')[1] || ''
  const publicRoute = publicRoutes.includes(rootPath);

  const [user, setUser] = useState()
  const [darkMode, setDarkMode] = useState(dark.includes(rootPath))

  useEffect(() => {
    const _user = supabaseClient.auth.user()

    if (!_user && !publicRoute) {
      router.push('/')
      return;
    }

    setUser(_user)
    setDarkMode(_user === null && dark.includes(rootPath));

    const { data, error } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (session === null) {
          setUser(null);
          setDarkMode(dark.includes(rootPath))
        }
        setDarkMode(_user === null && dark.includes(rootPath));
      }
    );

    return data.unsubscribe;
  }, [user, router, publicRoute, rootPath]);

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

