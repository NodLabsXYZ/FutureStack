import { useEffect, useRef, useState } from "react";
import { TWCenteredContent, TWCircleSpinner } from "."
import { completeUserRegistration } from "../lib";

const AccountRegistration = ({ user, onComplete }) => {
  const [message, setMessage] = useState()
  const registering = useRef(false)
  const userRef = useRef(user)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    if (registering.current) return;

    registering.current = true;

    if (!userRef.current) {
      onCompleteRef.current();
      return;
    }

    const register = async () => {
      const success = await completeUserRegistration(
        userRef.current,
        setMessage
      )

      if (success) {
        onCompleteRef.current()
      }
    }

    register()
  }, [])

  return (
    <TWCenteredContent>
      <div className='p-60'>
        <TWCircleSpinner message={message}/>
      </div>
    </TWCenteredContent>
  )
}

export default AccountRegistration;