import { useRouter } from 'next/router'

import {
  FutureStackFooter,
  FutureStackHeader, FutureStackNavigation
} from '.'

const dark = ['', 'login', 'register']

const FutureStackLayout = ({ user, children }) => {
  const router = useRouter();
  const rootPath = router.pathname.split('/')[1] || '';
  const isDark = !user && dark.includes(rootPath)

  const gradient = isDark ? {
    background: 'linear-gradient(#0C1322 10%, #5B5258 60%, #ECA33B 85%, #DB5224 100%)'
  } : {}

  return (
    <div className={`w-fit sm:w-full ${isDark ? 'text-white' : 'text-slate-900'}`} style={gradient}>
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