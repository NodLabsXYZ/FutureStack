import { useRouter } from 'next/router'
import { useMemo } from 'react'

import {
  FutureStackFooter,
  FutureStackHeader, FutureStackNavigation
} from '.'

const dark = ['', 'login', 'register']

const FutureStackLayout = ({ user, children }) => {
  const router = useRouter();

  const rootPath = useMemo(() => (
    router.pathname.split('/')[1] || ''
  ), [router.pathname])

  const isDark = useMemo(() => (
    !user && dark.includes(rootPath)
  ), [user, rootPath])

  const gradient = useMemo(() => isDark ? {
    background: 'linear-gradient(#0C1322 10%, #5B5258 60%, #ECA33B 85%, #DB5224 100%)'
  } : {}, [isDark])

  const textColor = useMemo(() => (
    isDark ? 'text-white' : 'text-slate-900'
  ), [isDark])

  return (
    <div className={`w-fit sm:w-full ${textColor}`} style={gradient}>
      <div className='container px-6 mx-auto pb-36'>
        <FutureStackHeader darkMode={isDark} user={user} />
        {user && <FutureStackNavigation />}
        {children}
      </div>
      <FutureStackFooter darkMode={isDark}/>
    </div>
  )

}

export default FutureStackLayout