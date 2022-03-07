import { ArweaveHeader } from '../../components/uploader';
import { NextLink, TWButton } from '../../components';

const ArweavePage = () => {
  return (
    <div>
      <ArweaveHeader />
      
      <div className='text-center mt-12'>
        Arweave stores your files permanently for a single up-front payment.
        <br />
        <br />
        1GB costs just $5 to upload and store forever.
        <br />
        <br />
        This is ideal for NFT projects but works well for any file.
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