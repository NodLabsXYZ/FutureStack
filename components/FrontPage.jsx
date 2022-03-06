import { NextLink } from ".";

const FrontPage = () => {
  return (
    <div className='p-36'>
      FRONT PAGE

      <div className='py-24'>
        <NextLink href='/arweave'>
          <a className='underline text-blue-600'>Arweave Uploader</a>
        </NextLink>
      </div>
    </div>
  )
}

export default FrontPage;