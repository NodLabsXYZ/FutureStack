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
                                                                <button
                                                                    type="button"
                                                                    className="w-full flex items-center justify-center bg-black border border-transparent text-white rounded-md py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                                                    onClick={() => setIsPaymentChosen(true)}
                                                                >
                                                                    <span className="sr-only">Pay with Apple Pay</span>
                                                                    <svg className="h-5 w-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 20">
                                                                        <path d="M9.536 2.579c-.571.675-1.485 1.208-2.4 1.132-.113-.914.334-1.884.858-2.484C8.565.533 9.564.038 10.374 0c.095.951-.276 1.884-.838 2.579zm.829 1.313c-1.324-.077-2.457.751-3.085.751-.638 0-1.6-.713-2.647-.694-1.362.019-2.628.79-3.323 2.017-1.429 2.455-.372 6.09 1.009 8.087.676.99 1.485 2.075 2.552 2.036 1.009-.038 1.409-.656 2.628-.656 1.228 0 1.58.656 2.647.637 1.104-.019 1.8-.99 2.475-1.979.771-1.122 1.086-2.217 1.105-2.274-.02-.019-2.133-.828-2.152-3.263-.02-2.036 1.666-3.007 1.742-3.064-.952-1.408-2.437-1.56-2.951-1.598zm7.645-2.76v14.834h2.305v-5.072h3.19c2.913 0 4.96-1.998 4.96-4.89 0-2.893-2.01-4.872-4.885-4.872h-5.57zm2.305 1.941h2.656c2 0 3.142 1.066 3.142 2.94 0 1.875-1.142 2.95-3.151 2.95h-2.647v-5.89zM32.673 16.08c1.448 0 2.79-.733 3.4-1.893h.047v1.779h2.133V8.582c0-2.14-1.714-3.52-4.351-3.52-2.447 0-4.256 1.399-4.323 3.32h2.076c.171-.913 1.018-1.512 2.18-1.512 1.41 0 2.2.656 2.2 1.865v.818l-2.876.171c-2.675.162-4.123 1.256-4.123 3.159 0 1.922 1.495 3.197 3.637 3.197zm.62-1.76c-1.229 0-2.01-.59-2.01-1.494 0-.933.752-1.475 2.19-1.56l2.562-.162v.837c0 1.39-1.181 2.379-2.743 2.379zM41.1 20c2.247 0 3.304-.856 4.227-3.454l4.047-11.341h-2.342l-2.714 8.763h-.047l-2.714-8.763h-2.409l3.904 10.799-.21.656c-.352 1.114-.923 1.542-1.942 1.542-.18 0-.533-.02-.676-.038v1.779c.133.038.705.057.876.057z" />
                                                                    </svg>
                                                                </button>

                                                                <div className="relative mt-4 mb-4">
                                                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                                        <div className="w-full border-t border-gray-200" />
                                                                    </div>
                                                                    <div className="relative flex justify-center">
                                                                        <span className="px-4 bg-white text-sm font-medium text-gray-500">or</span>
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    className="w-full flex items-center justify-center bg-black border border-transparent text-white rounded-md py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                                                    onClick={() => setIsPaymentChosen(true)}
                                                                >
                                                                    <span className="sr-only">Pay with Credit Card</span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                    </svg>
                                                                    <span className='ml-2'>Pay with Credit Card</span>
                                                                </button>

                                                                <div className="relative mt-4 mb-4">
                                                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                                        <div className="w-full border-t border-gray-200" />
                                                                    </div>
                                                                    <div className="relative flex justify-center">
                                                                        <span className="px-4 bg-white text-sm font-medium text-gray-500">or</span>
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    className="w-full flex items-center justify-center bg-black border border-transparent text-white rounded-md py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                                                    onClick={() => setIsPaymentChosen(true)}
                                                                >
                                                                    <span className="sr-only">Pay with Crypto</span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                    </svg>                                                                    <span className='ml-2'>Pay with Crypto</span>
                                                                </button>

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
