import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { uploaderContent } from '../../lib'

const MetadataInstructions = () => {

  return (
    <div>
      <div className='text-sm py-6 px-36'>
        <p className='py-3'>
          If you are creating NFTs that you want to display on OpenSea, 
          then it helps to have a metadata file (a file with more information about the artwork)
          associated with each image (the artwork). 
          Both the image and the metadata file can be store on Arweave.
        </p>
        <p className='py-3'>
          This tool makes it easy to coordinate a collection of images with a collection of metadata.
          It will upload the image, capture the url, edit the metadata to 
          include that url, and then upload the metadata.
        </p>
        <p className='py-3'>
          Then your NFTs can point to the appropriate metadata and services such as Opensea will properly load the 
          metadata and the image to display.
        </p>
        <div className='py-3'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-slate-600">
                  <ChevronDownIcon
                      className={`${open ? '' : '-rotate-90'} h-4 w-4 transform inline align-text-bottom`}
                      aria-hidden="true"
                  />
                  Show Example Files
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500 py-3">
                  {uploaderContent["Getting ready to upload"]}
                </Disclosure.Panel>
              </>
            )}            
          </Disclosure>
        </div>
        <div className='py-3'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-slate-600">
                  <ChevronDownIcon
                      className={`${open ? '' : '-rotate-90'} h-4 w-4 transform inline align-text-bottom`}
                      aria-hidden="true"
                  />
                  How to create and format your images and metadata
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500 py-3">
                  {uploaderContent["How to create and format your images and metadata"]}
                </Disclosure.Panel>
              </>
            )}            
          </Disclosure>
        </div>
        <div className='py-3'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-slate-600">
                  <ChevronDownIcon
                      className={`${open ? '' : '-rotate-90'} h-4 w-4 transform inline align-text-bottom`}
                      aria-hidden="true"
                  />
                  Show Example Results
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500 py-3">
                  {uploaderContent["Upload results and how to use them"]}
                </Disclosure.Panel>
              </>
            )}            
          </Disclosure>
        </div>
      </div>

    </div>
  )
}

export default MetadataInstructions;