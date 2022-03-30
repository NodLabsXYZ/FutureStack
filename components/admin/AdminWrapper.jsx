
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import store from 'store2'

const AdminWrapper = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const userStore = store.namespace("user")
    const checkProfile = async () => {
      let profile = userStore('profile');
      if (!profile) {
        profile = await getProfileTeamsProjects()
      }

      if (!profile.info?.admin) {
        router.push('/')
      } else {
        setAdmin(true)
      }
    }

    checkProfile()
  }, [router])

  if (!admin) {
    return <></>
  }

  return (
    <div>
      <h1 className='text-2xl pb-6'>
        Admin
      </h1>
      {children}
    </div>
  )
}

export default AdminWrapper;