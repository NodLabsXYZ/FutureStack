import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react';
import Spinner from '../../components/uploader/spinner';
import styles from '../../styles/Home.module.css'
import { FAKE_BUNDLR } from '../../utils/constants';
import store from 'store2';

type TempNftData = {
    clientTempFilePath: string,
    name: string,
    metadata: string
}

type UploadData = {
    baseURI: string,
    metadataFileNames: string[]
}

const getNftData = (): TempNftData[] => {
    const uploaderStore = store.namespace('uploader')
    const numberOfItemsToUpload = +uploaderStore('numberOfItemsToUpload');

    const nfts = [];
    for (let index = 0; index < numberOfItemsToUpload; index++) {
        const nftDataString = uploaderStore(index.toString());
        const nftData: TempNftData = JSON.parse(nftDataString);

        nfts.push(nftData);
    }
    return nfts
}

const uploadToArweave = async (
    nftObjects: TempNftData[],
    router: NextRouter
): Promise<void> => {
    const uploaderStore = store.namespace('uploader');

    let baseURI: string;
    let metadataFileNames: string[];

    /*
        This is to stub the bundlr call so we're not spending real SOL each time we test.
        You can change this value in /utils/constants.ts
        HOWEVER if you use the test data Tommy provided (or any other data you've uploaded before)
        it will be free 💸
    */
    if (FAKE_BUNDLR) {
        baseURI = 'https://arweave.net/HgSjSaOKq2mTSLvNb_2b224fA-r86z6Ogi0xTOWKaio/';
        metadataFileNames = ['0.json', '1.json', '2.json', '3.json']
        await new Promise(r => setTimeout(r, 5000));
    } else {
        const result = await uploadBulk(nftObjects);
        baseURI = result.baseURI;
        metadataFileNames = result.metadataFileNames;
    }

    uploaderStore('baseURI', baseURI);
    uploaderStore('metadataFileNames', metadataFileNames.join(','));

    router.push('/uploader/success')
}

const uploadBulk = async (nftObjects: TempNftData[]): Promise<UploadData> => {
    const formData = new FormData();
    for (let index = 0; index < nftObjects.length; index++) {
        const nftObject = nftObjects[index];
        formData.append(index.toString(), JSON.stringify(nftObject));
    }

    const options = {
        method: 'POST',
        body: formData
    }

    const response = await fetch('/api/uploader/uploadToBundlr', options);

    const { baseURI, metadataFileNames } = await response.json();
    return { baseURI, metadataFileNames };
}

const routeToSuccessIfUploadComplete = (router: NextRouter): boolean => {
    const uploaderStore = store.namespace('uploader');
    const baseURIFromLocal = uploaderStore('baseURI');
    const metadataFileNamesFromLocal = uploaderStore('metadataFileNames');

    const isUploadComplete = baseURIFromLocal?.length > 0 || metadataFileNamesFromLocal?.length > 0;

    if (isUploadComplete) {
        router.push('/uploader/success')
        return true;
    }
}


export default function Uploading() {
    const [isUploading, setIsUploading] = useState(false);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const router = useRouter();


    const isLocalStorageAvailable = typeof window !== "undefined";
    if (isLocalStorageAvailable && !isUploading) {
        const isUploadComplete = routeToSuccessIfUploadComplete(router);

        if (isUploadComplete) {
            return (<></>);
        }
        const nftObjects = getNftData();

        try {
            setIsUploading(true);
            uploadToArweave(nftObjects, router);
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