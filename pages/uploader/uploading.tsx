import { NextRouter, useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import Spinner from '../../components/uploader/spinner';
import styles from '../../styles/Home.module.css'
import { NftObject } from '../../types/NftObject';
import ProgressBar from "@ramonak/react-progress-bar";
import { getNameFromMetadataString } from '../../utils/metadataUtils';
import { useAppContext } from '../../context/state';
import { FAKE_BUNDLR } from '../../utils/constants';

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
    const numberOfItemsToUpload = +localStorage.getItem('numberOfItemsToUpload');

    const nfts = [];
    for (let index = 0; index < numberOfItemsToUpload; index++) {
        const nftDataString = localStorage.getItem(index.toString());
        const nftData: TempNftData = JSON.parse(nftDataString);

        nfts.push(nftData);
    }
    return nfts
}

const uploadToArweave = async (
    nftObjects: TempNftData[],
    router: NextRouter
): Promise<void> => {

    let baseURI: string;
    let metadataFileNames: string[];

    if (FAKE_BUNDLR) {
        baseURI = 'https://arweave.net/HgSjSaOKq2mTSLvNb_2b224fA-r86z6Ogi0xTOWKaio/';
        metadataFileNames = ['0.json', '1.json', '2.json', '3.json']
        await new Promise(r => setTimeout(r, 5000));
    } else {
        const result = await uploadBulk(nftObjects);
        baseURI = result.baseURI;
        metadataFileNames = result.metadataFileNames;
    }


    localStorage.setItem('baseURI', baseURI);
    localStorage.setItem('metadataFileNames', metadataFileNames.join(','));

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

// const uploadBulk = async (
//     nftObjects: TempNftData[],
//     setPercentCompleted: Dispatch<SetStateAction<number>>
// ): Promise<string[]> => {

//     const metadataUris: string[] = [];
//     for (let index = 0; index < nftObjects.length; index++) {
//         const metadataUri = await uploadSingle(nftObjects[index]);
//         metadataUris.push(metadataUri);
//         const percentCompleted = index / nftObjects.length * 100;
//         setPercentCompleted(percentCompleted);
//         // Waiting for 2 seconds when running locally helps with getting an idea of how long the real process will take
//         // if (process.env.NODE_ENV !== 'production') {
//         //     await new Promise(r => setTimeout(r, 2000));
//         // }
//     }
//     return metadataUris
// }

// const uploadSingle = async (nftObject: TempNftData) => {
//     // Very odd behavior. If you uncomment the commented lines in this funciton,
//     // you will see that the fetch call gets executed more than once. Not sure what the issue is.
//     // console.log('in uploadSingle');

//     const formData = new FormData();

//     formData.append('tempImageFilePath', nftObject.tempImageFilePath);

//     formData.append('metadata', nftObject.metadata);

//     const options = {
//         method: 'POST',
//         body: formData
//     }

//     const response = await fetch('/api/uploader/uploadSingle', options);

//     const { metadataUri } = await response.json();

//     console.log('==========');
//     console.log('name :>> ', getNameFromMetadataString(nftObject.metadata));
//     console.log('metadataUri :>> ', metadataUri);
//     console.log('==========');
//     return metadataUri;
// }

const routeToSuccessIfUploadComplete = (router: NextRouter): boolean => {
    const baseURIFromLocal = localStorage.getItem('baseURI');
    const metadataFileNamesFromLocal = localStorage.getItem('metadataFileNames');

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
                <div className='place-content-center'>
                    <br />
                    <br />
                    {/* <ProgressBar
                        completed={percentCompleted}
                        bgColor="#4F5AE5"
                        isLabelVisible={false}
                        labelColor="#e80909"
                        maxCompleted={100}
                    /> */}
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
                                    <strong>The Bundlr call is being stubbed.To actually call bundlr, change the <code>FAKE_BUNDLR</code> value in <code>/utils/constants.ts</code>
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