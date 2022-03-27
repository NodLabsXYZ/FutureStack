import { useEffect, useState } from 'react'
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { ArweaveLayout, UploaderCard } from '../../components/uploader';



const ArweavePage = () => {
  const [showLinkToExistingUploads, setShowLinkToExistingUploads] = useState(false);

  useEffect(() => {
    // const surveyStore = store.namespace(StoreName.survey)
    // surveyStore('arweave', null)

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
    <ArweaveLayout title='Uploader'>
      <div className="relative px-4 sm:px-6 pb-60 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
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

            <UploaderCard
              header='Upload any files'
              subHeader='Upload any files to the arweave blockchain for permanent storage.'
              buttonHref='/arweave/upload'
              buttonText='Get Started'

            />

            <UploaderCard
              header='Upload assets for NFTs'
              subHeader='Coordinate your images and metadata files for Opensea integration.'
              buttonHref='/arweave/metadata'
              buttonText='Get Started'

            />
          </div>
        </div>
      </div>
    </ArweaveLayout>
  );
}

export default ArweavePage;