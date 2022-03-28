import { FunctionComponent, useRef, useState } from "react"
// import styles from '../../styles/Home.module.css'
import UploadImages from './uploadImages'
import { formatBytes } from '../../lib/formatters';
import UploadMetadata from './uploadMetadata'
import EstimatedCost from './EstimatedCost'
import ErrorBanner from './ErrorBanner';
import UploadConfirmation from './UploadConfirmation';
import { FileWithPreview } from '../../types/FileWithPreview'
import { NftObject } from '../../types/NftObject'
import store from 'store2';
import { StoreName } from "../../enums/storeEnums"
import { SurveyDiscounts } from "../../enums/discountEnums"
import { SmallSpinner } from "./spinners"
import createNftObjects from "../../lib/createNftObjects";
import { calculatePurchasePriceInCents } from "../../lib/bundlr";

type UploaderProps = {
  onFilesSelected: () => void,
  project?: any
}

const NftUploader: FunctionComponent<UploaderProps> = ({ onFilesSelected, project }) => {
  const generalUploaderStore = store.namespace(StoreName.generalUploader);
  const surveyStore = store.namespace(StoreName.survey);

  const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([]);
  const imageBytes = useRef(0);
  const [metadataFiles, setMetadataFiles] = useState<File[]>([]);
  const metadataBytes = useRef(0);
  const [cost, setCost] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [nftObjects, setNftObjects] = useState<NftObject[]>();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const updateImageBytes = async (bytes: number) => {
    console.log('updateImageBytes :>> ', bytes);
    imageBytes.current = bytes;
    isReady();
    calculateCost();
  }

  const updateMetadataBytes = async (bytes: number) => {
    console.log('updateMetadataBytes :>> ', bytes);
    metadataBytes.current = bytes;   
    isReady() 
    calculateCost();
  }

  const isReady = () => {
    const _ready = (imageBytes.current > 0 && metadataBytes.current > 0)
    setReady(_ready);
  }

  const calculateCost = async () => {
    let totalBytes = imageBytes.current + metadataBytes.current;
    const survey = surveyStore('arweave');

    if (survey?.verified && !survey?.results?.claimedAt) {
      totalBytes = totalBytes - SurveyDiscounts.arweaveSurvey;
    }

    const _cost = calculatePurchasePriceInCents(totalBytes);
    setCost(_cost)
  }

  const continueToUpload = async () => {
    setLoading(true);
    if (imageFiles.length !== metadataFiles.length) {
      setErrorMessage("There must be the same number of image and metadata files.");
    } else {
      const nftObjs = await createNftObjects(
        imageFiles, 
        metadataFiles,
        setProcessedCount 
      );
      setNftObjects(nftObjs);

      // Remove this item of localStorage so the uploading.tsx page does not redirect
      generalUploaderStore.remove('baseURI');
      generalUploaderStore.remove('metadataFileNames');

      // So Uploading.tsx knows what local files to grab (there may be some leftover from the other type)
      generalUploaderStore('nextUploadType', StoreName.nftUploader)

      setLoading(false);
      onFilesSelected();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setShowUploadConfirmation(true);
    }
  }

  if (showUploadConfirmation) {
    return (
      <UploadConfirmation
        nftObjects={nftObjects}
        totalBytes={imageBytes.current + metadataBytes.current}
        projectId={project?.id}
      />
    )
  } else {
    return (
      <div>
        <main>
          <ErrorBanner showError={errorMessage} message={errorMessage} />
          <br />
          <UploadImages setImageFiles={setImageFiles} updateImageBytes={updateImageBytes} />
          <br />
          <br />
          <UploadMetadata setMetadataFiles={setMetadataFiles} updateMetadataBytes={updateMetadataBytes} />
          
          <div className='text-center mt-12'>

            {
              imageBytes.current + metadataBytes.current !== 0 && (
                <p>Upload size: {formatBytes(imageBytes.current + metadataBytes.current)}</p>
              )
            }

            {
              ready && (
                <div>
                  <EstimatedCost costInCents={cost} />
                </div>
              )
            }

            {
              ready && !loading && (
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
                <div className="mt-3">
                  <SmallSpinner />
                  <div className='mt-3'>
                    Processing {processedCount + 1} out of {imageFiles.length}
                  </div>
                </div>
              )
            }
          </div>

        </main>
      </div>
    )
  }
}

export default NftUploader;

