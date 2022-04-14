import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import {
  FutureStackFooter,
  FutureStackHeader, FutureStackNavigation
} from '.'

const dark = ['', 'login', 'register']
const darkStates = [
  {
    isDark: false,
    text: 'text-slate-900',
    gradient: {}
  },
  {
    isDark: true,
    text: 'text-white',
    gradient: {
      background: '#091729'
    }
  }
]

const FutureStackLayout = ({ user, children }) => {
  const router = useRouter();

  const isDark = useMemo(
    () => {
      const rootPath = router.pathname.split('/')[1] || '';
      return !user && dark.includes(rootPath);
    },
    [user, router.pathname]
  )

  const [darkState, setDarkState] = useState(
    isDark ? darkStates[0] : darkStates[1]
  );

  useEffect(() => {
    if (isDark) {
      setDarkState(darkStates[1])
    } else {
      setDarkState(darkStates[0])
    }
  }, [isDark])

  return (
    <div className={`w-fit sm:w-full ${darkState.text}`} style={darkState.gradient}>
      <div className='container px-6 mx-auto pb-36'>
        <FutureStackHeader darkMode={darkState.isDark} user={user} />
        <FutureStackNavigation user={user} />
        {children}
      </div>
      <FutureStackFooter darkMode={darkState.isDark}/>
    </div>
  )

}

export default FutureStackLayout