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
import ConfirmUpload from './confirmUpload';
import { FileWithPreview } from '../../types/FileWithPreview'
import { createArrayBufferNftObjects, createNftObjects } from '../../utils/createNftObjects'
import { NftObject } from '../../types/NftObject'
import NextLink from '../NextLink';

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
      setNftObjects(nftObjs);

      await addNftObjsToLocalStorage(nftObjs)

      // Remove this item of localStorage so the uploading.tsx page does not redirect
      localStorage.removeItem('baseURI');
      localStorage.removeItem('metadataFileNames');

      setShowConfirmUpload(true);
    }
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
          <NextLink href='/arweave/howItWorks'>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              How It Works
            </button>
          </NextLink>
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

async function addNftObjsToLocalStorage(nftObjs: NftObject[]): Promise<void> {
  for (let index = 0; index < nftObjs.length; index++) {
    const nftObj = nftObjs[index]
    const formData = new FormData()

    formData.append('image', nftObj.imageFile)

    const options = {
      method: 'POST',
      body: formData
    }

    const response = await fetch('/api/uploader/getTempFilePath', options)

    const { clientTempFilePath } = await response.json()


    console.log('clientTempFilePath :>> ', clientTempFilePath)

    const newNftObj = {
      clientTempFilePath,
      imageFileName: nftObj.imageFile.name,
      metadata: nftObj.metadata
    }
    const numberOfItemsToUpload = (index + 1).toString()
    localStorage.setItem(index.toString(), JSON.stringify(newNftObj))
    localStorage.setItem('numberOfItemsToUpload', numberOfItemsToUpload)
  }
}
