import { NextRouter, useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { LargeSpinner } from './spinners';
import styles from '../../styles/Home.module.css'
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { TempNftData, TempFileData } from '../../types/TempData';
import { ErrorType } from '../../enums/errorEnums';
import { uploadToBundlr } from '../../lib';

type UploadingProps = {
    setError: Dispatch<SetStateAction<ErrorType>>
}

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

    const manifestTags = [{ name: "Type", value: "manifest" }, { name: "Content-Type", value: "application/x.arweave-manifest+json" }];
    const manifest = {
        manifest: "arweave/paths",
        version: "0.1.0",
        index: { 
            path: "1"
        },
        paths: {}
    }

    for (let i=0; i<objects.length; ++i) {
        const id = await uploadToBundlr(objects[i]);
        manifest.paths[`${i+1}`] = id;
    }

    const manifestId = await uploadToBundlr(manifest, manifestTags);

    console.log("MANIFEST", manifestId)

    return { baseURI: manifestId, metadataFileNames: [] };
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


export default function Uploading(props: UploadingProps) {
    const router = useRouter();
    const generalUploadStore = store.namespace(StoreName.generalUploader);

    const [isUploading, setIsUploading] = useState(false);

    const handleUploadError = (error: Error) => {
        console.error('Upload failed:');
        console.error(error);
        props.setError(ErrorType.upload);
    }

    const isLocalStorageAvailable = typeof window !== "undefined";
    if (isLocalStorageAvailable && !isUploading) {
        const isUploadComplete = routeToSuccessIfUploadComplete(router);
        const uploadType: StoreName = generalUploadStore.get('nextUploadType');

        if (isUploadComplete) {
            return (<></>);
        }

        try {
            setIsUploading(true);
            if (uploadType === StoreName.nftUploader) {
                const nftObjects = getNfts();
                handleUploadNfts(nftObjects, router).catch(error => handleUploadError(error));
            } else if (uploadType === StoreName.filesUploader) {
                const files = getFiles();
                handleUploadFiles(files, router).catch(error => handleUploadError(error));
            } else {
                throw new Error("Error reading nextUploadType from local storage");
            }
        } catch (error) {
            console.error(error);
            props.setError(ErrorType.generic)
        }
    }

    return (
        <div>
            <main className={styles.main}>
                <div className='place-content-center text-center'>
                    <br />
                    <br />
                    <LargeSpinner />
                    <br />
                    <br />
                    <p>Please wait while your images and metadata are being uploaded to Arweave.</p>
                </div>
            </main>
        </div>
    )
}