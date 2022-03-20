import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FutureStackLayout } from '../components';
import { supabaseClient } from '../lib';
import { getSurvey, updateSurvey } from '../lib/queries';
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
        const survey = await getSurvey({ email: u.email })
        if (survey) {
          if (!survey.verified) {
            survey.verified = true;
            updateSurvey(survey.id, survey)    
          }
          surveyStore('arweave', survey)
        }
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

