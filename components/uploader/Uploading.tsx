import { NextRouter, useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { LargeSpinner } from './spinners';
import styles from '../../styles/Home.module.css'
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { ErrorType } from '../../enums/errorEnums';
import { upload } from '../../lib/bundlr';
import { FileToUpload, NftObject } from '../../types/NftObject';
import { ARWEAVE_BASE_URL } from 'arweave-nft-uploader/lib/constants';

type UploadingProps = {
    setError: Dispatch<SetStateAction<ErrorType>>,
    objectsToUpload: NftObject[] | FileToUpload[]
}

type UploadData = {
    baseURI: string,
    metadataFileNames: string[]
}

const handleUploadFiles = async (
    files: FileToUpload[],
    router: NextRouter
): Promise<void> => {
    console.log('files :>> ', files);

    const arweaveURIs = await uploadBulkFiles(files);

    saveResultToLocalStorageAndRouteToSuccess(router, StoreName.filesUploader, null, arweaveURIs)
}

const uploadBulkFiles = async (files: FileToUpload[]): Promise<string[]> => {
    const arweaveURIs = [];
    for (let index = 0; index < files.length; index++) {
        const fileToUpload = files[index];
        const tags = [{ name: "Content-Type", value: fileToUpload.contentType }];
        const byteCount = fileToUpload.file.size;
        const txId = await upload(fileToUpload.buffer, tags, byteCount);
        arweaveURIs.push(ARWEAVE_BASE_URL + txId);
    }
    return arweaveURIs;
}


const handleUploadNfts = async (
    nftObjects: NftObject[],
    router: NextRouter
): Promise<void> => {
    const { baseURI, metadataFileNames } = await uploadBulkNfts(nftObjects);

    saveResultToLocalStorageAndRouteToSuccess(router, StoreName.nftUploader, baseURI, metadataFileNames)
}

const uploadBulkNfts = async (objects: NftObject[]): Promise<UploadData> => {
    const nftsWithImagesUploaded = await setImageTxnIdsInMetadata(objects);

    const manifestId = await uploadManifestForObjects(nftsWithImagesUploaded);
    const baseURI = ARWEAVE_BASE_URL + manifestId + '/';

    const metadataFileNames = getMetadataFileNames(objects.length);


    return { baseURI, metadataFileNames };
}

const setImageTxnIdsInMetadata = async (nfts: NftObject[]): Promise<NftObject[]> => {
    const updatedNfts: NftObject[] = [];
    for (let index = 0; index < nfts.length; index++) {
        const nft = nfts[index];
        const imageTags = [{ name: "Content-Type", value: nft.imageContentType }];
        const byteCount = nft.imageFile.size;
        const id = await upload(nft.buffer, imageTags, byteCount);
        const metadata = JSON.parse(nft.metadata);
        metadata.image = ARWEAVE_BASE_URL + id;
        nft.metadata = JSON.stringify(metadata)
        updatedNfts.push(nft);
    }
    return updatedNfts;
}

const uploadManifestForObjects = async (nfts: NftObject[]): Promise<string> => {
    const manifestTags = [{ name: "Type", value: "manifest" }, { name: "Content-Type", value: "application/x.arweave-manifest+json" }];
    const manifest = {
        manifest: "arweave/paths",
        version: "0.1.0",
        index: {
            path: "0.json"
        },
        paths: {}
    }

    // Upload metadata and add to manifest file
    for (let i = 0; i < nfts.length; ++i) {
        const metadata = nfts[i].metadata;
        const metadataTags = [{ name: "Content-Type", value: "application/json" }];
        const byteCount = metadata.length * 4;
        const id = await upload(metadata, metadataTags, byteCount);
        manifest.paths[`${i}.json`] = { "id": id };
    }

    const byteCount = JSON.stringify(manifest).length * 4;
    return await upload(JSON.stringify(manifest), manifestTags, byteCount);
}

const getMetadataFileNames = (numberOfFiles: number): string[] => {
    const fileNames: string[] = [];
    for (let index = 0; index < numberOfFiles; index++) {
        fileNames.push(index + '.json');
    }
    return fileNames;
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
                handleUploadNfts(props.objectsToUpload as NftObject[], router).catch(error => handleUploadError(error));
            } else if (uploadType === StoreName.filesUploader) {
                handleUploadFiles(props.objectsToUpload as FileToUpload[], router).catch(error => handleUploadError(error));
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
                    <p>Please wait while your files are being uploaded to Arweave.</p>
                </div>
            </main>
        </div>
    )
}