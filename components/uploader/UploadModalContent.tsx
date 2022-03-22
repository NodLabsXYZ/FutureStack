import { useState } from "react";
import { ArweaveSurveyButton } from ".";
import { TWButton, NextLink } from "..";
import Uploading from "../../pages/uploader/uploading";
import { ArweaveSurvey } from "../surveys";
import Checkout from "./Checkout";
import PaymentTypeSelector from "./PaymentTypeSelector";

type UploadModalContentProps = {
    title: string,
    cost: number
}

export default function UploadModalContent(props: UploadModalContentProps) {
    const [survey, setSurvey] = useState(null)
    const [isPaymentTypeChosen, setIsPaymentTypeChosen] = useState(false);
    const [beginUpload, setBeginUpload] = useState(false);

    if (beginUpload) {
        return <Uploading />
    }

    if (survey) {
        return <ArweaveSurvey onCancel={() => setSurvey(false)} />
    }

    if (props.cost > 0) {
        // Choose payment type and pay
        if (!isPaymentTypeChosen) {
            return (
                <>
                    <PaymentTypeSelector
                        title={props.title}
                        cost={props.cost}
                        setIsPaymentTypeChosen={setIsPaymentTypeChosen}
                    />
                    <ArweaveSurveyButton onClick={() => setSurvey(true)} />
                </>
            )
        } else {
            return <Checkout setBeginUpload={setBeginUpload} />
        }
    } else {
        // Upload is free
        <div className='py-12 text-center'>
            <div className='text-lg font-bold mb-6'>
                Start Upload
            </div>
            <div>
                There is no charge for this upload.
            </div>
            <TWButton
                classMap={{
                    padding: '',
                    margin: 'mt-6'
                }}
            >
                <NextLink
                    href='/uploader/uploading'
                >
                    <a className='block px-3 py-1'>
                        Start Upload
                    </a>
                </NextLink>
            </TWButton>
        </div>
    }

    return <></>
}