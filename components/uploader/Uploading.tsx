import { NextRouter, useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { LargeSpinner } from './spinners';
// import styles from '../../styles/Home.module.css'
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { ErrorType } from '../../enums/errorEnums';
import { upload } from '../../lib/bundlr';
import { FileToUpload, NftObject } from '../../types/NftObject';
import { ARWEAVE_BASE_URL } from 'arweave-nft-uploader/lib/constants';
import { createAssets } from '../../lib/queries';

type UploadingProps = {
    projectId?: string;
    setError: Dispatch<SetStateAction<ErrorType>>,
    objectsToUpload: NftObject[] | FileToUpload[]
}

type UploadData = {
    baseURI: string,
    metadataFileNames: string[]
}

const handleUploadFiles = async (
    files: FileToUpload[],
    router: NextRouter,
    onItemUploaded: (index: number) => void,
    projectId?: string
): Promise<void> => {
    console.log('files :>> ', files);

    const arweaveURIs = await uploadBulkFiles(files, onItemUploaded, projectId);

    saveResultToLocalStorageAndRouteToSuccess(router, StoreName.filesUploader, null, arweaveURIs, projectId)
}

const uploadBulkFiles = async (
    files: FileToUpload[], 
    onItemCompleted: (index: number) => void, 
    projectId?: string
): Promise<string[]> => {
    const generalUploadStore = store.namespace(StoreName.generalUploader);
    const arweaveURIs = [];
    for (let index = 0; index < files.length; index++) {
        const fileToUpload = files[index];
        const tags = [{ name: "Content-Type", value: fileToUpload.contentType }];
        // const byteCount = fileToUpload.file.size;
        const txId = await upload(fileToUpload.buffer, tags);
        const fullUrl =  ARWEAVE_BASE_URL + txId;
        const data = { 
            name: fileToUpload.file.name,
            size: fileToUpload.file.size,
            content_type: fileToUpload.contentType,
            info: {
                arweaveUri: fullUrl 
            }
        };
        if (projectId) {
            await createAssets(projectId, data)
        } else {
            const existingUploads = (generalUploadStore("fileUploads") || []) as string[];
            generalUploadStore("fileUploads", [...existingUploads, data]);
        }
        arweaveURIs.push(fullUrl);
        onItemCompleted(index);
    }
    return arweaveURIs;
}


const handleUploadNfts = async (
    nftObjects: NftObject[],
    router: NextRouter,
    onFileUploaded: (index: number) => void,
    onMetadataUploaded: (index: number) => void,
    projectId?: string
): Promise<void> => {
    const { baseURI, metadataFileNames } = await uploadBulkNfts(
        nftObjects,
        onFileUploaded, 
        onMetadataUploaded,
        projectId
    );

    saveResultToLocalStorageAndRouteToSuccess(router, StoreName.nftUploader, baseURI, metadataFileNames, projectId)
}

const uploadBulkNfts = async (
    objects: NftObject[], 
    onFileCompleted: (index: number) => void, 
    onMetadataCompleted: (index: number) => void, 
    projectId?: string
): Promise<UploadData> => {
    const nftsWithImagesUploaded = await setImageTxnIdsInMetadata(
        objects,
        onFileCompleted
    );

    const manifestId = await uploadManifestForObjects(
        nftsWithImagesUploaded,
        onMetadataCompleted,
        projectId
    );
    const baseURI = ARWEAVE_BASE_URL + manifestId + '/';

    const metadataFileNames = getMetadataFileNames(objects.length);

    return { baseURI, metadataFileNames };
}

const setImageTxnIdsInMetadata = async (nfts: NftObject[], onFileCompleted: (index: number) => void): Promise<NftObject[]> => {
    const updatedNfts: NftObject[] = [];
    for (let index = 0; index < nfts.length; index++) {
        const nft = nfts[index];
        const imageTags = [{ name: "Content-Type", value: nft.imageContentType }];
        // const byteCount = nft.imageFile.size;
        const id = await upload(nft.buffer, imageTags);
        const metadata = JSON.parse(nft.metadata);
        metadata.image = ARWEAVE_BASE_URL + id;
        nft.metadata = JSON.stringify(metadata)
        updatedNfts.push(nft);
        onFileCompleted(index);
    }
    return updatedNfts;
}

const uploadManifestForObjects = async (
    nfts: NftObject[], 
    onItemCompleted: (index: number) => void,
    projectId?: string
): Promise<string> => {
    const generalUploadStore = store.namespace(StoreName.generalUploader);

    const files = [];
    const manifestTags = [{ name: "Type", value: "manifest" }, { name: "Content-Type", value: "application/x.arweave-manifest+json" }];
    const manifest = {
        manifest: "arweave/paths",
        version: "0.1.0",
        index: {
            path: "1"
        },
        paths: {}
    }

    // Upload metadata and add to manifest file
    for (let i = 0; i < nfts.length; ++i) {
        const metadata = nfts[i].metadata;
        const metadataTags = [{ name: "Content-Type", value: "application/json" }];
        // const byteCount = metadata.length * 2;
        const id = await upload(metadata, metadataTags);        
        manifest.paths[`${i + 1}`] = { "id": id };

        const data = {
            name: nfts[i].imageFile.name,
            size: nfts[i].imageFile.size,
            content_type: nfts[i].imageContentType,
            info: {
                arweaveUri: JSON.parse(metadata).image,
                arweaveMetadata: ARWEAVE_BASE_URL + id    
            }
        }
        
        if (projectId) {
            await createAssets(projectId, data)
        } else {
            files.push(data)
        }
        
        onItemCompleted(i);
    }

    // const byteCount = JSON.stringify(manifest).length * 2;
    const manifestId = await upload(JSON.stringify(manifest), manifestTags);

    if (projectId) {
        await createAssets(projectId, {
            name: "manifest.json",
            size: JSON.stringify(manifest).length * 2,
            content_type: "application/json",
            info: {
                arweaveManifest: ARWEAVE_BASE_URL + manifestId
            }
        })
    } else {
        const manifests = generalUploadStore('manifests') || {};
        manifests[ARWEAVE_BASE_URL + manifestId] = {
            size: JSON.stringify(manifest).length * 2,
            files: files
        };
        generalUploadStore('manifests', manifests);    
    }

    return manifestId;
}

const getMetadataFileNames = (numberOfFiles: number): string[] => {
    const fileNames: string[] = [];
    for (let index = 0; index < numberOfFiles; index++) {
        fileNames.push(`${index + 1}`);
    }
    return fileNames;
}

const saveResultToLocalStorageAndRouteToSuccess =
    (
        router: NextRouter,
        uploadType: StoreName,
        baseURI: string,
        metadataFileNames: string[],
        projectId?: string
    ): void => {
        const generalUploadStore = store.namespace(StoreName.generalUploader);

        console.log("HI0")
        generalUploadStore('lastSuccessfulUpload', uploadType);
        console.log("HI1")
        generalUploadStore('baseURI', baseURI);
        console.log("HI2")
        generalUploadStore('metadataFileNames', metadataFileNames.join(','));
        console.log("HI3")

        if (projectId) {
            router.push(`/project/${projectId}/asset`)
        } else {
            router.push('/uploader/success')
        }
    }

const routeToSuccessIfUploadComplete = (router: NextRouter, projectId?: string): boolean => {
    const generalUploadStore = store.namespace(StoreName.generalUploader);
    const baseURIFromLocal = generalUploadStore('baseURI');
    const metadataFileNamesFromLocal = generalUploadStore('metadataFileNames');

    const isUploadComplete = baseURIFromLocal?.length > 0 || metadataFileNamesFromLocal?.length > 0;

    if (isUploadComplete) {
        if (projectId) {
            router.push(`/project/${projectId}/asset`)
        } else {
            router.push('/uploader/success')
        }
        return true;
    }
}


export default function Uploading(props: UploadingProps) {
    const router = useRouter();
    const generalUploadStore = store.namespace(StoreName.generalUploader);
    const uploadType = useRef(generalUploadStore.get('nextUploadType'));
    const nftUpload = useRef(uploadType.current === StoreName.nftUploader);

    const [isUploading, setIsUploading] = useState(false);
    const [filesCompleted, setFilesCompleted] = useState(0)
    const [metadataCompleted, setMetadataCompleted] = useState(0)

    const routerRef = useRef(router);
    const propsRef = useRef(props)

    useEffect(() => {
        const handleUploadError = (error: Error) => {
            console.error('Upload failed:');
            console.error(error);
            propsRef.current.setError(ErrorType.upload);
        }

        const onFileUploaded = (index: number) => {
            setFilesCompleted(index);
        }

        const onMetadataUploaded = (index: number) => {
            setMetadataCompleted(index);
        }

        try {
            setIsUploading(true);
            if (nftUpload.current) {
                handleUploadNfts(
                    propsRef.current.objectsToUpload as NftObject[], 
                    routerRef.current, 
                    onFileUploaded, 
                    onMetadataUploaded,
                    props.projectId
                ).catch(error => handleUploadError(error));
            } else if (uploadType.current === StoreName.filesUploader) {
                handleUploadFiles(
                    propsRef.current.objectsToUpload as FileToUpload[], 
                    routerRef.current, 
                    onFileUploaded,
                    props.projectId
                ).catch(error => handleUploadError(error));
            } else {
                throw new Error("Error reading nextUploadType from local storage");
            }
        } catch (error) {
            console.error(error);
            propsRef.current.setError(ErrorType.generic)
        }
    }, [])

    const isLocalStorageAvailable = typeof window !== "undefined";
    if (isLocalStorageAvailable && !isUploading) {
        const isUploadComplete = routeToSuccessIfUploadComplete(router);

        if (isUploadComplete) {
            return (<></>);
        }        
    }

    return (
        <div>
            <main>
                <div className='place-content-center text-center'>
                    <br />
                    <br />
                    <LargeSpinner />
                    <br />
                    <br />
                    <p>Please wait while your files are being uploaded to Arweave.</p>
                    {filesCompleted > 0 && (
                        <div className='mt-6'>
                            {filesCompleted + 1} of {props.objectsToUpload.length} 
                            &nbsp;{nftUpload.current ? 'images' : 'files'} uploaded.
                        </div>
                    )}
                    {nftUpload.current && (
                        <div className='mt-6'>
                            {metadataCompleted + 1} of {props.objectsToUpload.length} metadata uploaded.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}