import {
  FutureStackHeader, FutureStackNavigation
} from '.'
import { hideForUploaderInitialLaunch } from '../utils/featureFlags';

const FutureStackLayout = ({ user, children }) => {

  return (
    <div className='container px-6 mx-auto'>
      <FutureStackHeader user={user} />
      {
        hideForUploaderInitialLaunch ? <></> :
          (
            <FutureStackNavigation />
          )
      }
      {children}
    </div>
  )

}

export default FutureStackLayout