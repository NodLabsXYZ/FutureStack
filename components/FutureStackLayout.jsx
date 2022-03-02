import {
  FutureStackHeader
} from '.'

const FutureStackLayout = ({ user, children }) => {

  return (
    <div className='container px-6'>
      <FutureStackHeader user={user} />
      {children}
    </div>
  )

}

export default FutureStackLayout