import Image from "next/image";
import { NextLink } from ".";
import TWButton from "./TWButton";

const FrontPage = () => {
  return (
    <div className='p-12 text-2xl font-thin text-white'>
      
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

      <div className='mt-48 ml-48 w-96'>
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

      <div className='mt-48 ml-60 w-1/2'>
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
            Store files on-chain forever,<br/>
            no recurring costs or hassle.
          </div>
          <div className='mt-3 text-lg'>
          Leverage Arweave&apos;s permanent storage 
          with our steamlined uploading. 
          Pay once - store forever.
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

      <div className='mt-48 flex justify-between relative'>
        <div className='opacity-30'>
          <Image
            src="/images/stacks.png"
            alt="Stacks"
            width={496}
            height={377}          
          />
        </div>
        <div></div>
        <div className='float-right'>
          <div className='font-semibold'>
            Private Hosted Blockchain
          </div>
          <div className='mt-3'>
            Share access with your team and customers,
            <br/>
            keep control and privacy.
          </div>
          <div className='mt-3 text-lg'>
            Fully control a hosted blockchain. Manage access and
            <br/>
            easily automate testing. No more faucets!
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

      <div className='mt-72 flex w-1/2 mx-auto'>
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