import {
  FutureStackFooter,
  FutureStackHeader, FutureStackNavigation
} from '.'

const FutureStackLayout = ({ user, publicRoute, children }) => {

  return (
    <div>
      <div className='container px-6 mx-auto'>
        <FutureStackHeader publicRoute={publicRoute} user={user} />
        {!publicRoute && <FutureStackNavigation />}
        {children}
      </div>
      <FutureStackFooter />
    </div>
  )

}

export default FutureStackLayout