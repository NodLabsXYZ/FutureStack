import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react';
import Spinner from '../../components/uploader/spinner';
import styles from '../../styles/Home.module.css'
import { FAKE_BUNDLR } from '../../utils/constants';
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { TempNftData, TempFileData } from '../../types/TempData';

type UploadData = {
    baseURI: string,
    metadataFileNames: string[]
}

const getNfts = (): TempNftData[] => {
    const nftUploaderStore = store.namespace(StoreName.nftUploader)
    const numberOfItemsToUpload = +nftUploaderStore('numberOfItemsToUpload');

    const nfts = [];
    for (let index = 0; index < numberOfItemsToUpload; index++) {
        const nftDataString = nftUploaderStore(index.toString());
        const nftData: TempNftData = JSON.parse(nftDataString);

        nfts.push(nftData);
    }
    return nfts
}

const getFiles = (): TempFileData[] => {
    const fileUploaderStore = store.namespace(StoreName.filesUploader);
    const numberOfItemsToUpload = +fileUploaderStore('numberOfItemsToUpload');

    const files = [];
    for (let index = 0; index < numberOfItemsToUpload; index++) {
        const fileDataString = fileUploaderStore(index.toString());
        const fileData: TempNftData = JSON.parse(fileDataString);

        files.push(fileData);
    }
    return files
}

const handleUploadFiles = async (
    files: TempFileData[],
    router: NextRouter
): Promise<void> => {
    const { baseURI, metadataFileNames } = await uploadBulk(files, '/api/uploader/uploadFilesToBundlr');

    saveResultToLocalStorageAndRouteToSuccess(router, StoreName.filesUploader, baseURI, metadataFileNames)
}

const handleUploadNfts = async (
    nftObjects: TempNftData[],
    router: NextRouter
): Promise<void> => {
    const { baseURI, metadataFileNames } = await uploadBulk(nftObjects, '/api/uploader/uploadNftsToBundlr');

    saveResultToLocalStorageAndRouteToSuccess(router, StoreName.nftUploader, baseURI, metadataFileNames)
}

const uploadBulk = async (objects: TempFileData[] | TempNftData[], uploadEndpoint: string): Promise<UploadData> => {
    const formData = new FormData();
    for (let index = 0; index < objects.length; index++) {
        const obj = objects[index];
        formData.append(index.toString(), JSON.stringify(obj));
    }

    const options = {
        method: 'POST',
        body: formData
    }

    const response = await fetch(uploadEndpoint, options);

    const { baseURI, metadataFileNames } = await response.json();
    return { baseURI, metadataFileNames };
}


const saveResultToLocalStorageAndRouteToSuccess =
    (
        router: NextRouter,
        uploadType: StoreName,
        baseURI: string,
        metadataFileNames: string[]
    ): void => {
        const generalUploadStore = store.namespace(StoreName.generalUploader);

        generalUploadStore('lastSuccessfulUpload', uploadType);
        generalUploadStore('baseURI', baseURI);
        generalUploadStore('metadataFileNames', metadataFileNames.join(','));

        router.push('/uploader/success')
    }

const routeToSuccessIfUploadComplete = (router: NextRouter): boolean => {
    const generalUploadStore = store.namespace(StoreName.generalUploader);
    const baseURIFromLocal = generalUploadStore('baseURI');
    const metadataFileNamesFromLocal = generalUploadStore('metadataFileNames');

    const isUploadComplete = baseURIFromLocal?.length > 0 || metadataFileNamesFromLocal?.length > 0;

    if (isUploadComplete) {
        router.push('/uploader/success')
        return true;
    }
}


export default function Uploading() {
    const router = useRouter();
    const generalUploadStore = store.namespace(StoreName.generalUploader);

    const [isUploading, setIsUploading] = useState(false);


    const isLocalStorageAvailable = typeof window !== "undefined";
    if (isLocalStorageAvailable && !isUploading) {
        const isUploadComplete = routeToSuccessIfUploadComplete(router);
        const uploadType: StoreName = generalUploadStore.get('nextUploadType');
        console.log('uploadType :>> ', uploadType);

        if (isUploadComplete) {
            return (<></>);
        }

        try {
            setIsUploading(true);
            if (uploadType === StoreName.nftUploader) {
                console.log('uploading nfts...');
                const nftObjects = getNfts();
                handleUploadNfts(nftObjects, router);
            } else if (uploadType === StoreName.filesUploader) {
                const files = getFiles();
                console.log('uploading files...');
                console.log('files :>> ', files);
                handleUploadFiles(files, router);
            } else {
                throw new Error("Error reading nextUploadType from local storage");
            }
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div>
            <main className={styles.main}>
                <div className='place-content-center text-center'>
                    <br />
                    <br />
                    <Spinner />
                    <br />
                    <br />
                    <p>Please wait while your images and metadata are being uploaded to Arweave.</p>
                    {
                        FAKE_BUNDLR ?
                            (
                                <>
                                    <br />
                                    <br />
                                    <strong>The Bundlr call is being stubbed. To actually call bundlr, change the <code>FAKE_BUNDLR</code> value in <code>/utils/constants.ts</code>
                                    </strong>
                                </>
                            ) :
                            (<></>)
                    }
                </div>
            </main>
        </div>
    )
}