import { NextLink, TWButton } from '..';
import { ArweaveHeader } from '.';

const ArweaveLayout = ({ title=null, children }) => {
  return (
    <div className=''>
      <ArweaveHeader title={title}/>

      {children}

      <div className='text-2xl text-center mt-60 flex w-1/2 mx-auto'>
        <div className=''>
          <div className='font-semibold'>
            New web3 services and infrastructure coming soon.
          </div>
          
          <div className='mt-3 text-lg'>
            Let us know what&apos;s slowing down your 
            web3 development process.  
          </div>          
          <div className='text-center mt-6'>
            <TWButton
              classMap={{
                background: 'bg-indigo-800',
                rounder: 'rounded-full'
              }}
            >
              <NextLink href='/'>
                <a className='px-3 py-1 text-lg align-text-top font-light'>
                  Learn More
                </a>
              </NextLink>
            </TWButton>
          </div>        
        </div>
      </div>
    </div>
  )
}

export default ArweaveLayout;