import Image from "next/image";
import { NextLink } from ".";
import TWButton from "./TWButton";
import { LightningBoltIcon, LockClosedIcon, CreditCardIcon, CheckIcon } from '@heroicons/react/outline'

const mainFeatures = [
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

const devFeatures = [
  {
    name: 'Upload Files',
    icon: CheckIcon,
  },
  {
    name: 'Pay Once',
    icon: CreditCardIcon,
  },
  {
    name: 'Store Forever',
    icon: LockClosedIcon,
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

      <div className='rotate-[2.84deg] absolute right-0 top-72 w-[120%] h-1/2'>
        <Image
          src="/images/particleWaves.png"
          alt="Background waves of particles"
          layout='fill'
          objectFit='contain'
        />
      </div>

      <div className="pt-80">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">futurestack values</h2>
          <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {mainFeatures.map((feature) => (
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

      <div className="mt-52 lg:grid lg:grid-cols-12 lg:gap-8 mx-24">
        <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left lg:flex lg:items-center">
          <div>
            <h1 className="mt-4 text-2xl tracking-tight font-bold text-white sm:mt-5 sm:leading-none lg:mt-6">
              Developers
            </h1>
            <p className="mt-3 text-base sm:mt-5">
              FutureStack leverages the power of blockchain data storage through Arweave without the hassle.
              Pay with a credit or debit card, and upload in seconds.
            </p>
            <dl className="mt-8 space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {devFeatures.map((feature) => (
                <div key={feature.name} className='relative'>
                  <dt>
                    <div
                      className="mt-1 absolute flex items-center px-2 py-2 border border-landingButtonBorder rounded-full bg-landingButtonBg"
                    >
                      <feature.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="mt-5 ml-12 text-base leading-6 text-center">{feature.name}</span>
                    </div>
                  </dt>
                </div>
              ))}
            </dl>
            <div className="mt-6 bg-[#2C323C] rounded-full overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#2B7BF2] to-landingButtonBorder rounded-full" style={{ width: '50%' }} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1"></div>
        <div className="mt-12 lg:col-span-4">
          <div
            className="relative block w-full border-2 border-white border-dashed rounded-lg p-12 text-center"
          >
            <span className="text-base">
              Drag and Drop or Click to Select Files
            </span>
            <div
              className="inline-flex items-center px-8 py-1 mx-4 border border-landingButtonBorder text-base rounded-full shadow-sm bg-landingButtonBg"
            >
              Select File
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default FrontPage;