import { NextRouter, useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import Header from '../../components/uploader/header';
import Spinner from '../../components/uploader/spinner';
import styles from '../../styles/Home.module.css'
import { NftObject } from '../../types/NftObject';
import ProgressBar from "@ramonak/react-progress-bar";

type TempNftData = {
    tempImageFilePath: string,
    metadata: string
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
    setPercentCompleted: Dispatch<SetStateAction<number>>,
    router: NextRouter
): Promise<void> => {
    const metadataUris = await uploadBulk(nftObjects, setPercentCompleted);

    localStorage.setItem('metadataUris', metadataUris.join(','));

    router.push('/uploader/success')

}


const uploadBulk = async (
    nftObjects: TempNftData[],
    setPercentCompleted: Dispatch<SetStateAction<number>>
): Promise<string[]> => {

    const metadataUris: string[] = [];
    for (let index = 0; index < nftObjects.length; index++) {
        const metadataUri = await uploadSingle(nftObjects[index]);
        metadataUris.push(metadataUri);
        const percentCompleted = index / nftObjects.length * 100;
        setPercentCompleted(percentCompleted);
        // Waiting for 2 seconds when running locally helps with getting an idea of how long the real process will take
        // if (process.env.NODE_ENV !== 'production') {
        //     await new Promise(r => setTimeout(r, 2000));
        // }
    }
    return metadataUris
}

const uploadSingle = async (nftObject: TempNftData) => {
    // Very odd behavior. If you uncomment the commented lines in this funciton,
    // you will see that the fetch call gets executed more than once. Not sure what the issue is.
    // console.log('in uploadSingle');

    const formData = new FormData();

    formData.append('tempImageFilePath', nftObject.tempImageFilePath);

    formData.append('metadata', nftObject.metadata);

    const options = {
        method: 'POST',
        body: formData
    }

    const response = await fetch('/api/uploader/uploadSingle', options);

    const { metadataUri } = await response.json();

    // console.log('completed upload for metadataUri :>> ', metadataUri);
    return metadataUri;
}

const routeToSuccessIfUploadComplete = (router: NextRouter): boolean => {
    const isUploadComplete = localStorage.getItem('metadataUris')?.length > 0;

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
            uploadToArweave(nftObjects, setPercentCompleted, router);
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className='place-content-center'>
                    <br />
                    <br />
                    <ProgressBar
                        completed={percentCompleted}
                        bgColor="#4F5AE5"
                        isLabelVisible={false}
                        labelColor="#e80909"
                        maxCompleted={100}
                    />
                    <br />
                    <br />
                    <p>Please wait while your images and metadata are being uploaded to Arweave.</p>
                </div>
            </main>
        </>
    )
}