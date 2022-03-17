import Image from "next/image";
import { NextLink } from ".";
import TWButton from "./TWButton";

const FrontPage = () => {
  return (
    <div className='p-12 text-2xl font-thin text-white'>
      
      <div className='pt-12 w-96 mx-auto'>
        <div>web3 infrastructure and services</div>
        <div className='font-semibold'>
          for developers and startups 
          who want to build new products,
          <div className='italic text-orange-600'>
            fast.
          </div>
        </div>
      </div>

      <div className='mt-36 ml-48 w-96'>
        <div className='font-semibold'>
          For a startup or idea to make it 
          in web3, your timing matters. 
        </div>
        <div className='mt-6'>
          Increase velocity, maintain control and 
          flexibility when developing and deploying 
          new web3 products. 
        </div>
        <div className='rotate-[27deg] absolute right-72 top-60'>
          <Image
            src="/images/ethereum-logo.png"
            alt="Ethereum Logo"
            width={301}
            height={582}
            className='opacity-40'
          />
        </div>
      </div>

      <div className='mt-36 ml-60 w-1/2'>
        <div className='float-left mr-6'>
          <Image
            src="/images/arweave-logo.png"
            alt="Arweave Logo"
            width={154}
            height={154}          
          />
        </div>
        <div className=''>
          <div className='font-semibold'>
            Arweave Uploader
          </div>
          <div className='mt-3'>
            Store assets and metadata forever,<br/>
            no recurring costs or hassle.
          </div>
          <div className='mt-3 text-lg'>
            Increase velocity, maintain control and 
            flexibility when developing and deploying 
            web3 products. 
          </div>          
        </div>
        <div className='text-center mt-6'>
          <TWButton
            classMap={{
              background: 'bg-indigo-800',
              rounder: 'rounded-full'
            }}
          >
            <NextLink href='/arweave'>
              <a className='px-3 py-1 text-lg align-text-top font-light'>
                Get Started
              </a>
            </NextLink>
          </TWButton>
        </div>        
      </div>
    </div>
  )
}

export default FrontPage;