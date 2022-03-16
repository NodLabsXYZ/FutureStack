import {
  FutureStackHeader, FutureStackNavigation
} from '.'

const FutureStackLayout = ({ user, publicRoute, children }) => {

  return (
    <div className='container px-6 mx-auto'>
      <FutureStackHeader publicRoute={publicRoute} user={user} />
      {!publicRoute && <FutureStackNavigation />}
      {children}
    </div>
  )

}

export default FutureStackLayout