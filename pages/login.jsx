import { SupabaseMagicLink, TWConstrainedCenteredContent } from "../components";

const LoginPage = () => {
  return (
    <TWConstrainedCenteredContent>
      <div className='py-12'>
        <SupabaseMagicLink />
      </div>
    </TWConstrainedCenteredContent>
  )
}

export default LoginPage;