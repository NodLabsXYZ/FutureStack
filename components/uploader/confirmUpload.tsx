import styles from '../../styles/Home.module.css'

import { NftObject } from '../../types/NftObject'
import NftObjectGrid from './nftObjectGrid'
import NftObjectViewerModal from './nftObjectViewerModal'
import { useState } from 'react'
import UploadModal from './UploadModal'


type ConfirmUploadProps = {
    nftObjects: NftObject[]
    purchasePrice: number
}

export default function ConfirmUpload(props: ConfirmUploadProps) {
    const [openNftViewerModal, setOpenNftViewerModal] = useState(false);
    const [openConfirmPaymentTypeModal, setOpenConfirmPaymentTypeModal] = useState(false);
    const [nftToShow, setNftToShow] = useState<NftObject>();

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
                purchasePriceInCents={props.purchasePrice}
                title='Ready to upload your images and metadata?'
                objectsToUpload={props.nftObjects}
            />
        </div>

    )
}