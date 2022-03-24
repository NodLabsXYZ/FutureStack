import styles from '../../styles/Home.module.css'

import { NftObject } from '../../types/NftObject'
import NftObjectGrid from './nftObjectGrid'
import NftObjectViewerModal from './nftObjectViewerModal'
import { useEffect, useMemo, useState } from 'react'
import UploadModal from './UploadModal'
import EstimatedCost from './EstimatedCost'
import store from 'store2'
import { SurveyDiscounts } from '../../enums/discountEnums'
import { StoreName } from '../../enums/storeEnums'
import calculatePurchasePriceInCents from '../../lib/bundlr/calculatePurchasePrice'


type UploadConfirmationProps = {
    nftObjects: NftObject[]
    totalBytes: number
}

export default function UploadConfirmation(props: UploadConfirmationProps) {
    const surveyStore = store.namespace(StoreName.survey);

    const [openNftViewerModal, setOpenNftViewerModal] = useState(false);
    const [openConfirmPaymentTypeModal, setOpenConfirmPaymentTypeModal] = useState(false);
    const [nftToShow, setNftToShow] = useState<NftObject>();
    const [purchasePriceInCents, setPurchasePriceInCents] = useState(0);

    const calculatePurchasePrice = useMemo(() => (totalBytes: number): number => {
        const survey = surveyStore('arweave');

        if (survey?.verified && !survey?.results?.claimedAt) {
            totalBytes = totalBytes - SurveyDiscounts.arweaveSurvey;
        }

        return calculatePurchasePriceInCents(totalBytes);
    }, [surveyStore]);

    useEffect(() => {
        setPurchasePriceInCents(calculatePurchasePrice(props.totalBytes));
    }, [setPurchasePriceInCents, calculatePurchasePrice, props.totalBytes]);

    return (
        <div>
            <main className={styles.main}>
                <div className='text-sm max-w-prose prose prose-indigo margin-auto'>
                    <p className='pt-3'>
                        Please confirm that the images and metadata have been combined together successfully.
                        Click an image to view its full metadata.
                    </p>
                    <p className='pt-3'>
                        Are the images and metadata mismatched? If so, make sure the image and metadata files match when their names are sorted in alphabetical order.
                        The easiest way to achieve this is to name your files by number, such as <code>1.jpeg, 2.jpeg, ...</code> and <code>1.json, 2.json, ...</code>
                    </p>
                </div>
                <NftObjectGrid
                    nftObjects={props.nftObjects}
                    setOpenNftViewerModal={setOpenNftViewerModal}
                    setNftToShow={setNftToShow}
                />

                <br />
                <EstimatedCost costInCents={purchasePriceInCents} />

                <br />
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpenConfirmPaymentTypeModal(true)}
                >
                    Looks good
                </button>


            </main>
            <NftObjectViewerModal
                open={openNftViewerModal}
                setOpen={setOpenNftViewerModal}
                nftToShow={nftToShow}
            />

            <UploadModal
                open={openConfirmPaymentTypeModal}
                setOpen={setOpenConfirmPaymentTypeModal}
                purchasePriceInCents={purchasePriceInCents}
                title='Ready to upload your images and metadata?'
                objectsToUpload={props.nftObjects}
            />
        </div>

    )
}