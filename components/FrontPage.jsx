import Image from "next/image";
import { NextLink } from ".";
import TWButton from "./TWButton";
import { LightningBoltIcon, LockClosedIcon, CreditCardIcon } from '@heroicons/react/outline'

const features = [
  {
    name: 'Frictionless upload',
    description:
      'Upload to Arweave in seconds and store your files forever.',
    icon: LightningBoltIcon,
  },
  {
    name: 'Immutable',
    description:
      'Once uploaded, your files are secure and can never be edited or deleted.',
    icon: LockClosedIcon,
  },
  {
    name: 'No recurring fees',
    description:
      'Scalable data storage solution for a flat fee. ',
    icon: CreditCardIcon,
  },
]

const FrontPage = () => {
  return (
    <div className='py-12 md:px-12 text-2xl font-thin text-white'>

      <div className='pt-10 text-center'>
        <div className="text-4xl font-bold mb-4">
          The easiest way to upload <br /> your files to the blockchain
        </div>
        <div className='text-base mx-64 font-slim'>
          Arweave is a blockchain built exclusively for the permanent storage of files.
          FutureStack makes uploading files to Arweave fast and easy.
        </div>
      </div>
      <div className="pt-80">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">futurestack values</h2>
          <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {features.map((feature) => (
              <div key={feature.name} className='relative'>
                <dt>
                  <div
                    className="mt-5 absolute flex items-center px-2 py-2 mx-4 border border-landingButtonBorder rounded-full bg-landingButtonBg"
                  >
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="mt-5 ml-20 text-base leading-6 font-medium text-center">{feature.name}</span>
                    <br />
                    <dd className="mt-1 ml-20 text-sm font-light">{feature.description}</dd>
                  </div>
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className='rotate-[2.84deg] absolute right-0 top-72 w-[120%] h-1/2'>
        <Image
          src="/images/particleWaves.png"
          alt="Background waves of particles"
          layout='fill'
          objectFit='contain'
        />
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