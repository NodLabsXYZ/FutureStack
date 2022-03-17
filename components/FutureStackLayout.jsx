import {
  FutureStackFooter,
  FutureStackHeader, FutureStackNavigation
} from '.'

const FutureStackLayout = ({ user, children }) => {

  return (
    <div className='text-white bg-gradient-to-b from-slate-900 via-slate-600 to-transparent'>
      <div className='bg-gradient-to-t from-orange-600 via-slate-600 to-transparent'>
        <div className='container px-6 mx-auto'>
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