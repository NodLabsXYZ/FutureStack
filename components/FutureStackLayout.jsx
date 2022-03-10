import {
  FutureStackHeader, FutureStackNavigation
} from '.'

const FutureStackLayout = ({ user, children }) => {

  return (
    <div className='container px-6 mx-auto'>
      <FutureStackHeader user={user} />
      <FutureStackNavigation />
      {children}
    </div>
  )

}

export default FutureStackLayout