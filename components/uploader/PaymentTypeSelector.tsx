import { Dialog } from "@headlessui/react"
import { Dispatch, SetStateAction } from "react"
import EstimatedCost from "./estimatedCost"

type PaymentTypeSelectionProps = {
    title: string,
    cost: number,
    setIsPaymentTypeChosen: Dispatch<SetStateAction<boolean>>
}

export default function PaymentTypeSelector(props: PaymentTypeSelectionProps) {
    return (
        <>
            <div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        {props.title}
                    </Dialog.Title>
                    <div className="mt-2">
                        <div className="text-sm text-gray-500">
                            <EstimatedCost cost={props.cost} minimumWarning={true} />
                        </div>
                    </div>
                </div>
            </div><div className="mt-5 sm:mt-6 sm:gap-3 sm:grid-flow-row-dense">
                <button
                    type="button"
                    onClick={() => props.setIsPaymentTypeChosen(true)}
                    className="w-full flex items-center justify-center bg-black border border-transparent text-white rounded-md py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                    <span className="sr-only">Pay with credit card</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className='ml-2'>Pay with credit card</span>
                </button>

                <div className="relative mt-4 mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-4 bg-white text-sm font-medium text-gray-500">or</span>
                    </div>
                </div>

                {/* Pay with Crypto not yet built, so type=button for now. */}
                <button
                    type="button"
                    role="link"
                    className="w-full flex items-center justify-center bg-slate-600 border border-transparent text-slate-400 rounded-md py-2 "
                >
                    <span className="sr-only">Pay with crypto</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className='ml-2'>Pay with crypto</span>
                </button>
                <div className='text-center'>Coming Soon!</div>

                <div className="relative mt-4 mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-4 bg-white text-sm font-medium text-gray-500">or</span>
                    </div>
                </div>

            </div>
        </>
    )
}
