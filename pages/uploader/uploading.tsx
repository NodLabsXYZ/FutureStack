import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LargeSpinner } from '../../components/uploader/spinners';
import styles from '../../styles/Home.module.css'
import { FAKE_BUNDLR } from '../../utils/constants';
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { TempNftData, TempFileData } from '../../types/TempData';

import { WebBundlr } from "@bundlr-network/client";
import { ethers } from 'ethers';

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

const pushToArweave = async (file, tags) => {
    // const provider = ethers.getDefaultProvider()
    // console.log("PROVIDER", provider)

    let serverSignature;
    const provider = {
        publicKey: {
            toBuffer: () => Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x65, 0x72]),
            byteLength: 32
        },
        signMessage: (message) => {
            return serverSignature;
        }
    }

    const bundlr = new WebBundlr("https://node1.bundlr.network", "solana", provider);

    // const tags = [{ name: "Type", value: "manifest" }, { name: "Content-Type", value: "application/x.arweave-manifest+json" }];

    // const manifest = {"manifest":"arweave/paths","version":"0.1.0","index":{"path":"basten.jpg"},"paths":{"basten.jpg":{"id":"cu2RWNO8T6t2zZ6f9FTIY5S_GY5A19jWfGp-fKBEAxk"},"baresi.jpg":{"id":"CJtmESbh5hRuc2KoykrM16ersMN9PrOhfgHIEiYP1AU"},"higuita.jpg":{"id":"Ql6IX6NCPXh-54BHVdZ18GePeeq2FseaK0tL3tWW4OU"},"brehme.jpg":{"id":"jhhWLDDLTILAgXMoXD0rpEE2VXxF9mS2Hjxul6M98rg"}}}

    const transaction = bundlr.createTransaction(file, { tags });

    const signature = await transaction.getSignatureData()

    const result = await fetch(
        '/api/uploader/bundlr_signature', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ signature })    
        }
    )

    const { signed } = await result.json();

    const serverSignedArray = []

    for (let i = 0; i < Object.keys(signed).length; i++) {
        serverSignedArray.push(signed[i])
    }

    serverSignature = new Uint8Array(serverSignedArray)

    transaction.getRaw().set(serverSignature, 2)

    // await transaction.sign();
    await transaction.upload();  
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

const handleUploadError = (error: Error, router: NextRouter) => {
    console.error('Upload failed:');
    console.error(error);
    router.push('/uploader/error');
}


export default function Uploading() {
    const router = useRouter();
    const generalUploadStore = store.namespace(StoreName.generalUploader);

    const [isUploading, setIsUploading] = useState(false);

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
                handleUploadNfts(nftObjects, router).catch(error => handleUploadError(error, router));
            } else if (uploadType === StoreName.filesUploader) {
                const files = getFiles();
                handleUploadFiles(files, router).catch(error => handleUploadError(error, router));
            } else {
                throw new Error("Error reading nextUploadType from local storage");
            }
        } catch (error) {
            console.error(error);
            router.push('/error');
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