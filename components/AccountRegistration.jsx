import { useEffect, useRef, useState } from "react";
import { TWCenteredContent, TWCircleSpinner } from "."
import { completeUserRegistration } from "../lib";

const AccountRegistration = ({ user, onComplete }) => {
  const [message, setMessage] = useState()
  const registering = useRef(false)
  const userRef = useRef(user)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    console.log("HI")
    if (registering.current) return;
    console.log("HI1")

    registering.current = true;

    if (!userRef.current) {
      onCompleteRef.current();
      return;
    }
    console.log("HI2")

    const register = async () => {
      console.log("HI3")
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