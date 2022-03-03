/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import EstimatedCost from './estimatedCost'
import Spinner from './spinner';
import { useRouter } from 'next/router'
import SuccessBanner from './successBanner';
import { XIcon } from '@heroicons/react/solid'

export default function UploadModal(props) {
    const [showSpinner, setShowSpinner] = useState(false);
    const [isPaymentChosen, setIsPaymentChosen] = useState(false);
    const cancelButtonRef = useRef(null)
    const router = useRouter();

    const upload = async () => {
        setShowSpinner(true);
        const imageFiles = props.imageFiles;
        const metadataFiles = props.metadataFiles;
        console.log('imageFiles :>> ', imageFiles);
        console.log('metadataFile', metadataFiles);
        const areFilesUndefined = !imageFiles || !metadataFiles;
        const areNumberOfFileMismatched = imageFiles.length !== metadataFiles.length;
        if (areFilesUndefined || areNumberOfFileMismatched) {
            console.error('image or metadata files incorrect');
            return;
        }
        const formData = new FormData();

        for (let index = 0; index < imageFiles.length; index++) {
            const imageFile = imageFiles[index];
            formData.append('image' + index, imageFile);
        }

        for (let index = 0; index < metadataFiles.length; index++) {
            const metadataFile = metadataFiles[index];
            formData.append('metadata' + index, metadataFile);
        }

        formData.forEach((file) => {
            console.log('file from formData:>> ', file.name);
        });
        const options = {
            method: 'POST',
            body: formData
        }

        try {
            const response = await fetch('/api/uploader/upload', options);

            const { uris } = await response.json();

            if (uris) {
                console.log('uris :>> ', uris);

                sessionStorage.setItem('uris', uris);

                router.push('uploader/success')
            }

        } catch (error) {
            console.error(error);
            props.setShowError(true);
            props.setErrorMessage(error.toString());
        } finally {
            setShowSpinner(false);
            props.setOpenModal(false);
        }


    }

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={props.setOpenModal}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        type="button"
                                        className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                                        onClick={() => props.setOpenModal(false)}
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <XIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            {
                                showSpinner ?
                                    (
                                        <Spinner />
                                    ) :
                                    (
                                        <>
                                            <div>
                                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>                </div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                        Ready to upload your images and metadata?
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            <EstimatedCost cost={props.cost} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-5 sm:mt-6 sm:gap-3 sm:grid-flow-row-dense">
                                                {
                                                    !isPaymentChosen ?
                                                        (
                                                            <>
                                                                <form action="/api/uploader/checkout_sessions" method="POST">
                                                                    <button
                                                                        type="submit"
                                                                        role="link"
                                                                        className="w-full flex items-center justify-center bg-black border border-transparent text-white rounded-md py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                                                    >
                                                                        <span className="sr-only">Pay with fiat</span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                        </svg>
                                                                        <span className='ml-2'>Pay with fiat</span>
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
                                                                        className="w-full flex items-center justify-center bg-black border border-transparent text-white rounded-md py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                                                    >
                                                                        <span className="sr-only">Pay with crypto</span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                        </svg>
                                                                        <span className='ml-2'>Pay with crypto</span>
                                                                    </button>
                                                                </form>
                                                            </>
                                                        ) :
                                                        (
                                                            <>
                                                                <div className='mb-4'>
                                                                    <SuccessBanner
                                                                        message="Your response has been recorded. This upload will be free of charge."
                                                                    />
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                                                    onClick={async () => await upload()}
                                                                >
                                                                    Upload
                                                                </button>
                                                            </>
                                                        )
                                                }
                                            </div>
                                            {/* <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                                <button
                                                    type="button"
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                    onClick={() => props.setOpenModal(false)}
                                                    ref={cancelButtonRef}
                                                >
                                                    Cancel
                                                </button>
                                            </div> */}
                                        </>
                                    )
                            }
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
