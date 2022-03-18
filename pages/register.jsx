import { SupabaseMagicLink, TWConstrainedCenteredContent } from "../components";

const RegisterPage = () => {
  return (
    <TWConstrainedCenteredContent>
      <div className='py-24'>
        <h2 className='text-lg text-center font-semibold mb-6'>
          Register A New Account
        </h2>
        <SupabaseMagicLink />
      </div>
    </TWConstrainedCenteredContent>
  )
}

export default RegisterPage;