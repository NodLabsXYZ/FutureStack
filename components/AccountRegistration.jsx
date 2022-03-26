import { useEffect, useRef, useState } from "react";
import { TWCenteredContent, TWCircleSpinner } from "."
import { completeUserRegistration } from "../lib";

const AccountRegistration = ({ user, onComplete }) => {
  const [message, setMessage] = useState()
  const registering = useRef(false)

  useEffect(() => {
    if (registering.current) return;

    registering.current = true;

    if (!user) {
      onComplete();
      return;
    }

    const register = async () => {
      const success = await completeUserRegistration(
        user,
        setMessage
      )

      if (success) {
        onComplete()
      }
    }

    register()
  }, [user, onComplete])

  return (
    <TWCenteredContent>
      <div className='p-60'>
        <TWCircleSpinner message={message}/>
      </div>
    </TWCenteredContent>
  )
}

export default AccountRegistration;