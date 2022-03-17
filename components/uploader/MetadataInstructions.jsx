import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { uploaderContent } from '../../lib'

const MetadataInstructions = () => {

  return (
    <div className='max-w-prose prose prose-indigo mx-auto'>
      <div className='text-sm pt-3'>
        <p>
          This tool makes it easy to coordinate a collection of images with a collection of metadata.
        </p>
       
        
        <div className='py-3'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-slate-600 font-semibold">
                  <ChevronDownIcon
                      className={`${open ? '' : '-rotate-90'} h-4 w-4 transform inline align-text-bottom`}
                      aria-hidden="true"
                  />
                  Why do I need to do this?
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500">
                  {uploaderContent["Why upload metadata"]}
                </Disclosure.Panel>
              </>
            )}            
          </Disclosure>
        </div>
        <div className='py-3'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-slate-600 font-semibold">
                  <ChevronDownIcon
                      className={`${open ? '' : '-rotate-90'} h-4 w-4 transform inline align-text-bottom`}
                      aria-hidden="true"
                  />
                  Show Example Files
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500">
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
                <Disclosure.Button className="text-slate-600 font-semibold">
                  <ChevronDownIcon
                      className={`${open ? '' : '-rotate-90'} h-4 w-4 transform inline align-text-bottom`}
                      aria-hidden="true"
                  />
                  How to create and format your images and metadata
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500">
                  {uploaderContent["How to create and format your images and metadata"]}
                </Disclosure.Panel>
              </>
            )}            
          </Disclosure>
        </div>
        <div className='pt-3'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-slate-600 font-semibold">
                  <ChevronDownIcon
                      className={`${open ? '' : '-rotate-90'} h-4 w-4 transform inline align-text-bottom`}
                      aria-hidden="true"
                  />
                  Show Example Results
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500">
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