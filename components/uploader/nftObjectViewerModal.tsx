/* This example requires Tailwind CSS v2.0+ */
import { Dispatch, Fragment, SetStateAction, Suspense, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NftObject } from '../../types/NftObject'
import React from 'react';
import { getNameFromMetadataString } from "../../utils/metadataUtils";
import Image from 'next/image'
import JsonDisplay from '../JsonDisplay';

type NftObjectViewerModalProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>,
    nftToShow: NftObject
}

type NftContentProps = {
    name: string
    preview: string,
    metadata: string
}

function NftContent(props: NftContentProps) {
    return (
        <div className="sm:flex">
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <Image
                    className="w-64 flex-shrink-0 mx-10 mt-32 rounded-lg"
                    src={props.preview}
                    alt={props.name}
                    width={240}
                    height={240}
                    layout="intrinsic"
                />
            </div>
            <div>
                <h4 className="text-lg font-bold">{props.name}</h4>
                <div className='mt-4'>
                    <JsonDisplay
                        src={JSON.parse(props.metadata)}
                    />
                </div>
            </div>
        </div>
    )
}

export default function NftObjectViewerModal(props: NftObjectViewerModalProps) {

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={props.setOpen}>
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
                        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
                            <NftContent
                                name={getNameFromMetadataString(props.nftToShow?.metadata)}
                                preview={props.nftToShow?.imageFile.preview}
                                metadata={props.nftToShow?.metadata}
                            />
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
