import { FunctionComponent } from "react"
import styles from '../../styles/Home.module.css'
import UploadImages from './uploadImages'
import { useEffect, useState } from 'react'
import { formatBytes } from '../../utils/formatters';
import UploadMetadata from './uploadMetadata'
import { getCostToSaveBytesInDollars } from '../../utils/costEstimator'
import EstimatedCost from './estimatedCost'
import ErrorBanner from './ErrorBanner';
import ConfirmUpload from './ConfirmUpload';
import { FileWithPreview } from '../../types/FileWithPreview'
import { createNftObjects } from '../../utils/createNftObjects'
import { NftObject } from '../../types/NftObject'
import store from 'store2';
import { StoreName } from "../../enums/storeEnums"
import { SurveyDiscounts } from "../../enums/discountEnums"
import { addNftObjsToLocalStorage } from "../../utils/localStorageUtils"
import { SmallSpinner } from "./spinners"

type UploaderProps = {
  onFilesSelected: () => void
}

const NftUploader: FunctionComponent<UploaderProps> = ({ onFilesSelected }) => {
  const generalUploaderStore = store.namespace(StoreName.generalUploader);
  const surveyStore = store.namespace(StoreName.survey);
  const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([]);
  const [imageBytes, setImageBytes] = useState(0);
  const [metadataFiles, setMetadataFiles] = useState<File[]>([]);
  const [metadataBytes, setMetadataBytes] = useState(0);
  const [cost, setCost] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);
  const [nftObjects, setNftObjects] = useState<NftObject[]>();
  const [loading, setLoading] = useState(false);

  const updateImageBytes = async (bytes: number) => {
    console.log('updateImageBytes :>> ', bytes);
    setImageBytes(bytes);
    calculateCost();
  }

  const updateMetadataBytes = async (bytes: number) => {
    console.log('updateMetadataBytes :>> ', bytes);
    setMetadataBytes(bytes);
  calculateCost();
  }

  const calculateCost = async () => {
    let totalBytes = imageBytes + metadataBytes;
    const survey = surveyStore('arweave');

    if (survey?.verified && !survey?.results?.claimedAt) {
      totalBytes = totalBytes - SurveyDiscounts.arweaveSurvey;
    }

    const cost = await getCostToSaveBytesInDollars(totalBytes);
    setCost(cost)
  }

  const continueToUpload = async () => {
    setLoading(true);
    if (imageFiles.length !== metadataFiles.length) {
      setErrorMessage("There must be the same number of image and metadata files.");
    } else {
      const nftObjs = await createNftObjects(imageFiles, metadataFiles);
      setNftObjects(nftObjs);

      await addNftObjsToLocalStorage(nftObjs)

      // Remove this item of localStorage so the uploading.tsx page does not redirect
      generalUploaderStore.remove('baseURI');
      generalUploaderStore.remove('metadataFileNames');

      // So Uploading.tsx knows what local files to grab (there may be some leftover from the other type)
      generalUploaderStore('nextUploadType', StoreName.nftUploader)

      setLoading(false);
      onFilesSelected();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setShowConfirmUpload(true);
    }
  }

  if (showConfirmUpload) {
    return (
      <ConfirmUpload
        nftObjects={nftObjects}
        cost={cost}
      />
    )
  } else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <ErrorBanner showError={errorMessage} message={errorMessage} />
          <br />
          <UploadImages setImageFiles={setImageFiles} updateImageBytes={updateImageBytes} />
          <br />
          <br />
          <UploadMetadata setMetadataFiles={setMetadataFiles} updateMetadataBytes={updateMetadataBytes} />
          <br />
          <br />

          {
            imageBytes + metadataBytes !== 0 && (
              <p>Upload size: {formatBytes(imageBytes + metadataBytes)}</p>
            )
          }

          {
            cost !== 0 && (
              <div>
                <EstimatedCost cost={cost} />
              </div>
            )
          }

          {
            imageBytes > 0 && metadataBytes > 0 && !loading && (
              <button
                type="button"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={continueToUpload}
              >
                Continue
              </button>
            )
          }
          {
            loading && (
              <span className="mt-2">
                <SmallSpinner />
              </span>
            )
          }

        </main>
      </div>
    )
  }
}

export default NftUploader;
