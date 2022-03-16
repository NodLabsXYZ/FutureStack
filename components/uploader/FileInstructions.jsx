import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'

const FileInstructions = () => {

  return (
    <div>
      <div className='text-sm py-6 text-center'>
        <p className='py-3'>
          Select any file, collection of files, or folder of files to upload to Arweave. 
        </p>
        <p className='py-3'>
          Once selected you will get a price estimate and, once uploaded, urls that point to each file.
        </p>
      </div>

    </div>
  )
}

export default FileInstructions;