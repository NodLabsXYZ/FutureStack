import { useEffect, useState } from 'react'
import { NextLink } from '../../components';
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { ArweaveLayout } from '../../components/uploader';

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


  // useEffect(() => {
  //   const pushToArweave = async () => {
      
  //     const tags = [{ name: "Type", value: "manifest" }, { name: "Content-Type", value: "application/x.arweave-manifest+json" }];
    
  //     const manifest = {"manifest":"arweave/paths","version":"0.1.0","index":{"path":"basten.jpg"},"paths":{"basten.jpg":{"id":"cu2RWNO8T6t2zZ6f9FTIY5S_GY5A19jWfGp-fKBEAxk"},"baresi.jpg":{"id":"CJtmESbh5hRuc2KoykrM16ersMN9PrOhfgHIEiYP1AU"},"higuita.jpg":{"id":"Ql6IX6NCPXh-54BHVdZ18GePeeq2FseaK0tL3tWW4OU"},"brehme.jpg":{"id":"jhhWLDDLTILAgXMoXD0rpEE2VXxF9mS2Hjxul6M98rg"}}}

  //     const id = await upload(manifest, tags)
  //     console.log("RESULT", id);      
  //   }

  //   pushToArweave();
  // }, [])

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
    </ArweaveLayout>
  );
}

export default ArweavePage;