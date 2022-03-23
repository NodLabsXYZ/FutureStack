import { Dispatch, SetStateAction, useState } from "react";
import { ArweaveSurveyButton } from ".";
import { TWButton } from "..";
import { ErrorType } from "../../enums/errorEnums";
import Uploading from "./Uploading";
import ErrorPage from "../ErrorPage";
import { ArweaveSurvey } from "../surveys";
import Checkout from "./Checkout";
import PaymentTypeSelector from "./PaymentTypeSelector";
import { useRouter } from "next/router";
import { NftObject } from "../../types/NftObject";

type UploadModalContentProps = {
    title: string,
    cost: number,
    setCanClose: Dispatch<SetStateAction<boolean>>,
    nfts: NftObject[]
}

export default function UploadModalContent(props: UploadModalContentProps) {
    const router = useRouter();

    const [survey, setSurvey] = useState(null)
    const [isPaymentTypeChosen, setIsPaymentTypeChosen] = useState(false);
    const [beginUpload, setBeginUpload] = useState(false);
    const [error, setError] = useState<ErrorType>();

    const handleRetryUpload = () => {
        // Consider counting errors and doing something after the third retry
        console.log('handle retry works');
        setError(null);
    }

    if (error) {
        switch (error) {
            case ErrorType.upload:
                return (
                    <ErrorPage
                        heading="Your upload failed"
                        subheading="You may retry - it won't cost you anything extra. Or, you can reach out to support."
                        primaryButtonText="Retry upload"
                        primaryButtonCallbackFn={handleRetryUpload}
                    />
                )
            default:
                return (
                    <ErrorPage
                        heading="There was an error"
                        subheading="The team has been notified and we'll get to it right away. You can also:"
                        primaryButtonText="Start over"
                        primaryButtonCallbackFn={() => router.push('/')}
                    />
                )
        }
    }

    if (beginUpload) {
        props.setCanClose(false)
        return <Uploading
            setError={setError}
            nfts={props.nfts}
        />
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
        return (
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
                    <button onClick={() => setBeginUpload(true)} className='block px-3 py-1'>
                        Start Upload
                    </button>
                </TWButton>
            </div>
        )
    }

    return <></>
}