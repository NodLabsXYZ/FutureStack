import {
  FutureStackFooter,
  FutureStackHeader, FutureStackNavigation
} from '.'

const FutureStackLayout = ({ user, gradient="", children }) => {

  return (
    <div className='text-white' style={{ background: 'linear-gradient(#0C1322 10%, #5B5258 60%, #ECA33B 85%, #DB5224 100%);'}}>
      <div className=''>
        <div className='container px-6 mx-auto pb-96'>
          <FutureStackHeader user={user} />
          {user && <FutureStackNavigation />}
          {children}
        </div>
        <FutureStackFooter />
      </div>
    </div>
  )

}

export default FutureStackLayout