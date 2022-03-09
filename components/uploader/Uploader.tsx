import { FunctionComponent } from "react"
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import UploadImages from '../../components/uploader/uploadImages'
import { useEffect, useState } from 'react'
import { formatBytes } from '../../utils/formatters';
import UploadMetadata from '../../components/uploader/uploadMetadata'
import { getCostToSaveBytesInDollars } from '../../utils/costEstimator'
import EstimatedCost from '../../components/uploader/estimatedCost'
import UploadModal from '../../components/uploader/uploadModal';
import Error from '../../components/uploader/error';
import ConfirmUpload from '../../components/uploader/confirmUpload';
import { FileWithPreview } from '../../types/FileWithPreview'
import { createArrayBufferNftObjects, createNftObjects } from '../../utils/createNftObjects'
import { NftObject } from '../../types/NftObject'
import { useAppContext } from '../../context/state';
type UploaderProps = {
}

const Uploader: FunctionComponent<UploaderProps> = () => {
  const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([]);
  const [imageBytes, setImageBytes] = useState(0);
  const [imageCost, setImageCost] = useState(0);
  const [metadataFiles, setMetadataFiles] = useState<File[]>([]);
  const [metadataBytes, setMetadataBytes] = useState(0);
  const [metadataCost, setMetadataCost] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);
  const [nftObjects, setNftObjects] = useState<NftObject[]>();

  const appContext = useAppContext();

  const updateImageBytes = async (bytes: number) => {
    console.log('updateImageBytes :>> ', bytes);
    setImageBytes(bytes);
    const imageCost = await getCostToSaveBytesInDollars(bytes);
    setImageCost(imageCost);
  }

  const updateMetadataBytes = async (bytes: number) => {
    console.log('updateMetadataBytes :>> ', bytes);
    setMetadataBytes(bytes);
    const metadataCost = await getCostToSaveBytesInDollars(bytes);
    setMetadataCost(metadataCost);
  }

  const continueToUpload = async () => {
    if (imageFiles.length !== metadataFiles.length) {
      setErrorMessage("There must be the same number of image and metadata files.");
    } else {
      const nftObjs = await createNftObjects(imageFiles, metadataFiles);
      console.log('nftObjs :>> ', nftObjs);
      setNftObjects(nftObjs);

      // THIRD TRY - React Context

      // // first, remove everything from the current state
      // for (let index = 0; index < appContext.length; index++) {
      //   appContext.pop();
      // }
      // console.log('appContext :>> ', appContext);

      // // Add nft objects to react context
      // for (let index = 0; index < nftObjs.length; index++) {
      //   const nftObj = nftObjs[index];
      //   appContext.push(nftObj);
      // }

      // console.log('appContext :>> ', appContext);
      
      // SECOND TRY - local storage
      

      for (let index = 0; index < nftObjs.length; index++) {
        const nftObj = nftObjs[index];
        const formData = new FormData();

        formData.append('image', nftObj.imageFile);

        const options = {
          method: 'POST',
          body: formData
        }


        const response = await fetch('/api/uploader/getTempFilePath', options);

        const { clientTempFilePath } = await response.json();


        console.log('clientTempFilePath :>> ', clientTempFilePath);

        const newNftObj = {
          clientTempFilePath,
          imageFileName: nftObj.imageFile.name,
          metadata: nftObj.metadata
        }
        const numberOfItemsToUpload = (index + 1).toString()
        localStorage.setItem(index.toString(), JSON.stringify(newNftObj));
        localStorage.setItem('numberOfItemsToUpload', numberOfItemsToUpload);
      }

      // Remove this item of localStorage so the uploading.tsx page does not redirect
      localStorage.removeItem('baseURI');
      localStorage.removeItem('metadataFileNames');



      // FIRST TRY - FileReader
      
      // let counter = 0;
      // nftObjs.forEach(nftObj => {
      //   const reader = new FileReader();
      //   reader.addEventListener('load', async () => {

      //     const formData = new FormData();

      //     formData.append('image', nftObj.imageFile);

      //     const options = {
      //       method: 'POST',
      //       body: formData
      //     }


      //     const response = await fetch('/api/uploader/getFilePath', options);

      //     const { filePath: imageFilePath } = await response.json();


      //     console.log('imageFilePath :>> ', imageFilePath);

      //     const newNftObj = {
      //       // imageFile: reader.result.toString(),
      //       imageFilePath,
      //       metadata: nftObj.metadata
      //     }
      //     localStorage.setItem(counter.toString(), JSON.stringify(newNftObj));
      //     counter++;
      //     localStorage.setItem('numberOfItemsToUpload', counter.toString());
      //   });

      //   reader.readAsDataURL(nftObj.imageFile);
      // });

      setShowConfirmUpload(true);
    }
  }

  const testAddToReactContext = async () => {
    const nftObjs = await createNftObjects(imageFiles, metadataFiles);
    console.log('nftObjs :>> ', nftObjs);

    console.log('appContext :>> ', appContext);
    
    appContext.push('hello');
    
    console.log('appContext :>> ', appContext);
  }

  const testBundlrUpload = async () => {
    // const arrayBufferNftObjects = await createArrayBufferNftObjects(imageFiles, metadataFiles);

    // const formData = new FormData();
    // for (let index = 0; index < arrayBufferNftObjects.length; index++) {
    //   const arrayBufferNftObject = arrayBufferNftObjects[index];

    //   formData.append('file_' + index, new Blob([arrayBufferNftObject.arrayBufferFile]));

    //   formData.append('metadata_' + index, arrayBufferNftObject.metadata);
    // }

    const nftObjs = await createNftObjects(imageFiles, metadataFiles);
    setNftObjects(nftObjs);

    const formData = new FormData();
    for (let index = 0; index < nftObjs.length; index++) {
      const nftObj = nftObjs[index];


      formData.append('image_' + index, nftObj.imageFile);

      formData.append('metadata_' + index, nftObj.metadata);
    }


    const options = {
      method: 'POST',
      body: formData
    }

    const response = await fetch('/api/uploader/uploadToBundlr', options);


  }

  if (showConfirmUpload) {
    return (
      <ConfirmUpload
        nftObjects={nftObjects}
        cost={imageCost + metadataCost}
      />
    )
  } else {
    return (
      <div className={styles.container}>
        <Head>
          <title>Bulk NFT Upload</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>

        <main className={styles.main}>
          <Error showError={errorMessage} message={errorMessage} />
          <div>
            Before uploading your metadata, make sure it complies with&nbsp;
            <a href="https://docs.opensea.io/docs/metadata-standards" target='_blank' rel="noreferrer" className="text-blue-600 visited:text-purple-600">
              OpenSea&apos;s Metadata Standards
            </a>
            &nbsp;if your NFTs will be on Ethereum or Polygon.
          </div>
          <br />
          <br />
          <UploadImages setImageFiles={setImageFiles} updateImageBytes={updateImageBytes} />
          <br />
          <br />
          <UploadMetadata setMetadataFiles={setMetadataFiles} updateMetadataBytes={updateMetadataBytes} />
          <br />
          <br />


          {
            imageBytes + metadataBytes === 0 ?
              (<></>) :
              (
                <p>Upload size: {formatBytes(imageBytes + metadataBytes)}</p>
              )
          }

          {
            imageCost + metadataCost === 0 ? (<></>) : (
              <div>
                <EstimatedCost cost={imageCost + metadataCost} />
              </div>
            )
          }

          {
            imageBytes > 0 && metadataBytes > 0 ?
              (
                <>
                  <br />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={continueToUpload}
                  >
                    Continue
                  </button>

                  {/* FOR TESTING ONLY */}
                  <br />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={testBundlrUpload}
                  >
                    TEST upload to Bundlr
                  </button>
                  <br />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={testAddToReactContext}
                  >
                    TEST add to react context
                  </button>
                </>
              ) :
              (<></>)
          }

        </main>

        <UploadModal
          open={openModal}
          setOpenModal={setOpenModal}
          setShowError={setShowError}
          setErrorMessage={setErrorMessage}
          cost={imageCost + metadataCost}
          imageFiles={imageFiles}
          metadataFiles={metadataFiles}
        />
      </div>
    )
  }
}

export default Uploader;