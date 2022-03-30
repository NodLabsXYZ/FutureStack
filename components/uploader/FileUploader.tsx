import { useEffect, useState } from 'react'
import { formatBytes } from "../../lib/formatters"
import EstimatedCost from './EstimatedCost'
import ErrorBanner from './ErrorBanner';
import { FileWithPreview } from '../../types/FileWithPreview'
import store from 'store2';
import FileDropzone from './FileDropzone';
import { StoreName } from "../../enums/storeEnums";
import { SmallSpinner } from "./spinners";
import { SurveyDiscounts } from '../../enums/discountEnums';
import UploadModal from "./UploadModal";
import { FileToUpload } from "../../types/NftObject";
import { calculatePurchasePriceInCents } from "../../lib/bundlr";
import { FileListDisplay } from './FileListDisplay';

type FileUploaderProps = {
    project?: any
}

export default function FileUploader(props: FileUploaderProps) {
    const generalUploaderStore = store.namespace(StoreName.generalUploader)
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [filesBytes, setFilesBytes] = useState(0);
    const [purchasePriceInCents, setPurchasePriceInCents] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLinkToExistingUploads, setShowLinkToExistingUploads] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completedSurvey, setCompletedSurvey] = useState();
    const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>();

    useEffect(() => {
        if (window) {
            // Re-initialize generalUploaderStore to have access in useEffect
            const generalUploaderStore = store.namespace(StoreName.generalUploader)
            const baseURIFromLocal = generalUploaderStore('baseURI');
            const metadataFileNames = generalUploaderStore('metadataFileNames');
            if (baseURIFromLocal && metadataFileNames) {
                setShowLinkToExistingUploads(true);
            }
        }
    }, []);


    const addFiles = async (newFiles: FileWithPreview[]): Promise<void> => {
        const oldAndNewFiles = files;
        console.log('files pre :>> ', files);
        for (let index = 0; index < newFiles.length; index++) {
            const file = newFiles[index];
            oldAndNewFiles.push(file);
        }
        console.log('oldAndNewFiles :>> ', oldAndNewFiles);
        setFiles(oldAndNewFiles);
    }

    const updateFilesBytes = async (bytes: number): Promise<void> => {
        console.log('updateFilesBytes :>> ', bytes);
        console.log('current filesBytes :>> ', filesBytes);
        const newTotalBytes = filesBytes + bytes;
        console.log('newTotalBytes :>> ', newTotalBytes);
        setFilesBytes(newTotalBytes - (completedSurvey ? SurveyDiscounts.arweaveSurvey : 0));
        const newFilesCost = calculatePurchasePriceInCents(newTotalBytes);
        setPurchasePriceInCents(newFilesCost);
    }

    const continueToUpload = async () => {
        setLoading(true);

        setFilesToUpload(await getFilesToUpload(files));

        // Remove this item of localStorage so the uploading.tsx page does not redirect
        generalUploaderStore.remove('baseURI');
        generalUploaderStore.remove('metadataFileNames');

        // So Uploading.tsx knows what local files to grab (there may be some leftover from the other type)
        generalUploaderStore('nextUploadType', StoreName.filesUploader)

        setLoading(false);
        setOpenModal(true);
    }

    const getFilesToUpload = async (files: FileWithPreview[]): Promise<FileToUpload[]> => {
        const filesToUpload: FileToUpload[] = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const buffer = Buffer.from(await file.arrayBuffer())
            const contentType = file.type

            const fileToUpload: FileToUpload = {
                file,
                buffer,
                contentType
            }
            filesToUpload.push(fileToUpload);
        }
        return filesToUpload;
    }

    return (
        <div>
            <main>
                <ErrorBanner showError={errorMessage} message={errorMessage} />
                <FileDropzone
                    addFiles={addFiles}
                    addBytes={updateFilesBytes}
                />
                <br />
                {
                    files.length > 0 && (
                        <FileListDisplay files={files} />
                    )
                }
                <div className='text-center mt-6'>
                    {
                        filesBytes !== 0 &&
                        (
                            <p>Upload size: {formatBytes(filesBytes)}</p>
                        )
                    }

                    {
                        purchasePriceInCents !== 0 && (
                            <div>
                                <EstimatedCost costInCents={purchasePriceInCents} />
                            </div>
                        )
                    }

                    {
                        files.length > 0 && !loading &&
                        (
                            <div className='mt-6'>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={continueToUpload}
                                >
                                    Continue
                                </button>
                            </div>
                        )
                    }
                    {
                        loading &&
                        <span className="mt-2">
                            <SmallSpinner />
                        </span>
                    }

                </div>
            </main>

            <UploadModal
                open={openModal}
                setOpen={setOpenModal}
                title='Ready to upload your files?'
                purchasePriceInCents={purchasePriceInCents}
                objectsToUpload={filesToUpload}
                projectId={props.project?.id}
            />
        </div>
    )
}
