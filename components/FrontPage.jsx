import Image from "next/image";
import { NextLink } from ".";
import TWButton from "./TWButton";

const FrontPage = () => {
  return (
    <div className='py-12 md:px-12 text-2xl font-thin text-white'>
      
      <div className='pt-24 w-96 mx-auto'>
        <div>web3 infrastructure and services</div>
        <div className='font-semibold'>
          for developers and startups 
          who want to build new products,
          <div className='italic text-orange-600'>
            fast.
          </div>
        </div>
      </div>

      <div className='mt-48 sm:ml-12 xl:ml-48 w-96'>
        <div className='font-semibold'>
          For a startup or idea to make it 
          in web3, your timing matters. 
        </div>
        <div className='mt-6'>
          Increase velocity, maintain control and 
          flexibility when developing and deploying 
          new web3 products. 
        </div>
        <div className='rotate-[27deg] absolute right-72 top-72'>
          <Image
            src="/images/ethereum-logo.png"
            alt="Ethereum Logo"
            width={301}
            height={582}
            className='opacity-40'
          />
        </div>
      </div>

      <div className='mt-48 sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto'>
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
            Store files on-chain forever,
            <br className='hidden sm:block' />
            no recurring costs or hassle.
          </div>
          <div className='mt-3 text-lg sm:overflow-hidden'>
            Leverage Arweave&apos;s permanent storage&nbsp; 
            <br className='hidden sm:block' />
            with our steamlined uploader.&nbsp; 
            <br className='hidden sm:block' />
            Pay once - store forever.
          </div>          
        </div>
        <div className='text-center sm:text-left sm:pl-44 mt-6'>
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

      <div className='mt-48 sm:pr-24 flex justify-between relative'>
        <div className='hidden sm:block opacity-30 -mt-12'>
          <Image
            src="/images/stacks.png"
            alt="Stacks"
            width={496}
            height={377}          
          />
        </div>
        <div className='float-right sm:w-96 sm:mr-24'>
          <div className='font-semibold'>
            Private Hosted Blockchain
          </div>
          <div className='mt-3'>
            Share access with your team and customers,
            keep control and privacy.
          </div>
          <div className='mt-3 text-lg'>
            Fully control a hosted blockchain. Manage access and
            easily automate testing. No more faucets!
          </div>          
          <div className='text-center mt-6'>
            <TWButton>
              <NextLink href='/arweave'>
                <a className='px-3 py-1 text-lg align-text-top font-light'>
                  Join Waitlist
                </a>
              </NextLink>
            </TWButton>
          </div>        
        </div>
      </div>

      <div className='mt-72 flex text-center sm:w-1/2 mx-auto'>
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
              <NextLink href='/arweave'>
                <a className='px-3 py-1 text-lg align-text-top font-light'>
                  Join Waitlist
                </a>
              </NextLink>
            </TWButton>
          </div>        
        </div>
      </div>
    </div>
  )
}

export default FrontPage;