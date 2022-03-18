import {
  FutureStackFooter,
  FutureStackHeader, FutureStackNavigation
} from '.'

const FutureStackLayout = ({ user, darkMode=false, children }) => {
  const gradient = darkMode ? {
    background: 'linear-gradient(#0C1322 10%, #5B5258 60%, #ECA33B 85%, #DB5224 100%)'
  } : {}

  return (
    <div className={`${darkMode ? 'text-white' : 'text-slate-900'}`} style={gradient}>
      <div className='container px-6 mx-auto pb-36'>
        <FutureStackHeader darkMode={darkMode} user={user} />
        {user && <FutureStackNavigation />}
        {children}
      </div>
      <FutureStackFooter darkMode={darkMode}/>
    </div>
  )

}

export default FutureStackLayout