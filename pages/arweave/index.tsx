import { useEffect, useState } from 'react'
import { NextLink, TWButton } from '../../components';
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';

type UploadCardContent = {
  header: string,
  subHeader: string,
  buttonText: string,
  buttonHref: string
}

function UploadCard(props: UploadCardContent): JSX.Element {
  return (
    <div className="s overflow-hidden shadow rounded-lg divide-y divide-gray-200 bg-white">
      <div className="px-4 py-5 sm:px-6 text-center prose">
        <h2>{props.header}</h2>
      </div>
      <div className="px-4 py-5 sm:p-6 text-center text-slate-900">
        {props.subHeader}
        <br />
        <NextLink href={props.buttonHref}>
          <a
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {props.buttonText}
          </a>
        </NextLink>

      </div>
    </div>
  )
}

const ArweavePage = () => {
  const [showLinkToExistingUploads, setShowLinkToExistingUploads] = useState(false);

  useEffect(() => {
    if (window) {
      const generalUploaderStore = store.namespace(StoreName.generalUploader);
      const baseURIFromLocal = generalUploaderStore('baseURI');
      const metadataFileNames = generalUploaderStore('metadataFileNames');
      if (baseURIFromLocal && metadataFileNames) {
        setShowLinkToExistingUploads(true);
      }
    }
  }, []);

  return (
    <div>
      <div className="relative px-4 sm:px-6 lg:pt-24 pb-96 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-semibold sm:text-3xl">Arweave Uploader</h2>
            <div className="mt-3 max-w-2xl mx-auto text-xl sm:mt-4 font-light">
              <p className="pt-6">
                Arweave stores your files permanently for a single up-front payment.
              </p>
              <p className="pt-6">
                500MB costs just $5 to upload and store forever.
              </p>
              <p className="pt-6">
                This is ideal for NFT projects but works well for any file.            
              </p>
            </div>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none">

            <UploadCard
              header='Upload any files'
              subHeader='Upload any files to the arweave blockchain for permanent storage.'
              buttonHref='/arweave/upload'
              buttonText='Get Started'

            />

            <UploadCard
              header='Upload assets for NFTs'
              subHeader='Coordinate your images and metadata files for Opensea integration.'
              buttonHref='/arweave/metadata'
              buttonText='Get Started'

            />
          </div>
        </div>
      </div>

      <div className='text-2xl text-center mt-72 flex w-1/2 mx-auto'>
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
  );
}

export default ArweavePage;