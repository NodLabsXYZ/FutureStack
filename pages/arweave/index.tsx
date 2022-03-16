import { useEffect, useState } from 'react'
import { ArweaveHeader } from '../../components/uploader';
import { NextLink, TWButton } from '../../components';
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';

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
      <ArweaveHeader />

      <div className='text-center mt-12'>
        Arweave stores your files permanently for a single up-front payment.
        <br />
        <br />
        500MB costs just $5 to upload and store forever.
        <br />
        <br />
        This is ideal for NFT projects but works well for any file.

        <br />
        <br />
        <NextLink href='/arweave/how-it-works'>
          <a
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            How It Works
          </a>
        </NextLink>
        <br />
        <br />
        {
          showLinkToExistingUploads ? (
            <NextLink href='/uploader/success'>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Last Upload
              </button>
            </NextLink>

          ) : (
            <></>
          )
        }

      </div>

      <div className='mt-12 flex justify-center'>
        <div className='border p-6 w-60 mr-24'>
          <h2 className='text-center font-semibold'>
            Upload Any Files
          </h2>
          <p className='p-3 text-center text-sm'>
            Upload any files to the arweave blockchain for permanent storage.
          </p>
          <div className='py-3 text-center'>
            <NextLink href='/arweave/upload'>
              <TWButton>
                Get Started
              </TWButton>
            </NextLink>
          </div>
        </div>
        <div className='border p-6 w-60'>
          <h2 className='text-center font-semibold'>
            Upload Files & Metadata
          </h2>
          <p className='p-3 text-center text-sm'>
            Coordinate your uploads with metadata files for Opensea integration.
          </p>
          <div className='py-3 text-center'>
            <NextLink href='/arweave/metadata'>
              <TWButton>
                Get Started
              </TWButton>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArweavePage;