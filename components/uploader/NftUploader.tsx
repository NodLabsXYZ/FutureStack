import { FunctionComponent, useState } from "react"
import ErrorBanner from './ErrorBanner';
import UploadConfirmation from './UploadConfirmation';
import { FileWithPreview } from '../../types/FileWithPreview'
import { NftObject } from '../../types/NftObject'
import store from 'store2';
import { StoreName } from "../../enums/storeEnums"
import createNftObjects from "../../lib/createNftObjects";
import FileDropzone from "./FileDropzone";
import { getTotalSizeInBytesFromFileList, separateImageAndMetadataFiles } from "../../lib";

type UploaderProps = {
  onFilesSelected: () => void,
  project?: any
}

const NftUploader: FunctionComponent<UploaderProps> = ({ onFilesSelected, project }) => {
  const generalUploaderStore = store.namespace(StoreName.generalUploader);
  const surveyStore = store.namespace(StoreName.survey);

  const [errorMessage, setErrorMessage] = useState('');
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [totalBytes, setTotalBytes] = useState(0);
  const [nftObjects, setNftObjects] = useState<NftObject[]>();
  const [processedCount, setProcessedCount] = useState(0);

  const continueToUpload = async (files: FileWithPreview[]): Promise<void> => {
    const { imageFiles, metadataFiles } = separateImageAndMetadataFiles(files);
    setTotalBytes(getTotalSizeInBytesFromFileList(files));
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

      onFilesSelected();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setShowUploadConfirmation(true);
    }
  }

  if (showUploadConfirmation) {
    return (
      <UploadConfirmation
        nftObjects={nftObjects}
        totalBytes={0}
        projectId={project?.id}
      />
    )
  } else {
    return (
      <main>
        <ErrorBanner showError={errorMessage} message={errorMessage} />
        <br />
        <FileDropzone
          addFiles={continueToUpload}
        />
      </main>
    )
  }
}

export default NftUploader;

