import React, { useEffect, useState } from 'react';
import NextLink from '../../components/NextLink';
import styles from '../../styles/Home.module.css'
import { CodeBlock, dracula } from "react-code-blocks";
import Image from 'next/image';
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import JsonDisplay from '../../components/JsonDisplay';
import ContractTokenUriDisplay from '../../components/uploader/ContractUriDisplay';

type Section = {
    title: string,
    content: string | JSX.Element
}

type AccordionProps = {
    sectionList: Section[]
}

const exampleImageBaseURI = 'https://arweave.net/cvToh8C_sM9FYhGcpWqSAOLJqO2Anv6V4QXtT3VOLh4/';
const exampleFileName = '1.jpg';
const exampleImage = exampleImageBaseURI + exampleFileName;
const exampleMetadataBaseURI = 'https://arweave.net/HgSjSaOKq2mTSLvNb_2b224fA-r86z6Ogi0xTOWKaio/';
const exampleMetadataFileNames = "['0.json', '1.json', '2.json', ...]"
const exampleMetadataLink = exampleMetadataBaseURI + '0.json';

const uploadingFilesContent: Section[] = [
    {
        title: "Supported file types",
        content:
            "All file types, directories, and any quantity of each is supported.",
    },
    {
        title: "Upload results and how to use them",
        content:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
]

const uploadingNFTsContent: Section[] = [
    {
        title: "What an NFT actually is",
        content: (
            <>
                Because it takes so much money to store data on chains like Ethereum, an NFT is mostly
                a URL pointer (called the <code>TokenURI</code>) to information about the NFT, called the <code>metadata</code>.
                This <code>metadata</code> is a JSON file that has different attributes and traits of the NFT, including another
                URL pointing to where the image is stored.
                <br /><br />
                The <code>TokenURI</code> which points to the metadata and <code>ImageURI</code> which points to the image can be URLs that point
                to files stored on Arweave.
            </>
        )
    },
    {
        title: "Arweave can store data for NFTs on any blockchain and works with OpenSea",
        content:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        title: "Why Arweave is perfect for NFT image and metadata storage",
        content:
            "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        title: "How to create and format your images and metadata",
        content: (
            <>
                <p>Each NFT should have two files associated with it:</p>
                <ul role="list">
                    <li>An image file (<code>.png</code>, <code>.jpeg</code>, <code>.gif</code>, etc.)</li>
                    <li>A metadata file (<code>.json</code>) with the traits of the NFT</li>
                </ul>
                <p>
                    Before uploading your metadata, make sure it complies with&nbsp;
                    <a href="https://docs.opensea.io/docs/metadata-standards" target='_blank' rel="noreferrer" className="text-blue-600 visited:text-purple-600">
                        OpenSea's Metadata Standards
                    </a>
                    &nbsp;if your NFTs will be on Ethereum or Polygon.
                </p>
                <p>Here's an example of an image and its associated metadata that could be used when creating an NFT:</p>
                <ExampleImageAndMetadata />
                <p>
                    The <code>image</code> property of your metadata needs to exist but can just be an empty string. This will get
                    overwritten in the upload process.
                </p>
                <p>
                    Recommended tools to create your metadata:
                    <ul role="list">
                        <li>
                            <a href="https://www.niftygenerator.xyz/">Nifty Generator</a> (no code required)
                        </li>
                        <li>
                            <a href="https://github.com/HashLips/hashlips_art_engine">HashLips Art Engine</a> (coding required)
                        </li>
                    </ul>
                </p>
                <p>
                    Or, play around with some images and metadata that already work:
                    <br />
                    <a href="">Download example images and metadata</a>
                    <br />
                    <i>Make sure to unzip the folder before using.</i>
                </p>
            </>
        )
    },
    {
        title: "Getting ready to upload",
        content: (
            <>
                <p>
                    When you upload your NFT assets, you'll need to upload two separate directories: one for your images and one for your metadata.
                </p>
                <p>
                    Your files should have the following structure:
                </p>
                <ExampleFileStructure />
                <p>
                    <strong>The files will be read in alphanumeric order.</strong> The first image file will be matched with the
                    first metadata file and uploaded together. The best way to do this is to name them by incrementing
                    number. However, it is not required to have any specific names for your folders or files
                    when you upload them using this tool.
                </p>
                <p>
                    When uploading, no need to individually select each file. You can just drop or select the entire directory for images or metadata.
                </p>
            </>
        )
    },
    {
        title: "Upload results and how to use them",
        content: (
            <>
                <p>
                    When the upload finishes, you&apos;ll get two things:
                    <ul className='m-2'>
                        <li>
                            A <code>baseURI</code> that looks something like:
                            <br />
                            <code>{exampleMetadataBaseURI}</code>
                        </li>
                        <li>
                            A list of file names that look like:
                            <br />
                            <code>{exampleMetadataFileNames}</code>
                        </li>
                    </ul>
                </p>
                <p>
                    Each file name can be appended to the end of the <code>baseURI</code> to form the <code>TokenURI</code> of each NFT.
                    Calling this <code>TokenURI</code> will query Arweave and return the metadata JSON file for that NFT.
                </p>
                <p>
                    Try it out:
                    <br />
                    <a
                        href={exampleMetadataLink}
                        target='_blank'
                        rel="noreferrer"
                    >
                        {exampleMetadataLink}
                    </a>
                </p>
                <p>
                    Dealing with <code>TokenURI</code>s shaped like this can lead to gas optimizations in your smart contract:
                    <br />
                    <span className='not-prose text-sm text'>
                        <ContractTokenUriDisplay />
                    </span>
                </p>
            </>
        )
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function Accordion(props: AccordionProps) {
    const sectionList = props.sectionList;
    return (
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                {sectionList.map((section) => (
                    <Disclosure as="div" key={section.title} className="pt-6">
                        {({ open }) => (
                            <>
                                <dt className="text-lg">
                                    <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                        <span className="font-medium text-gray-900">{section.title}</span>
                                        <span className="ml-6 h-7 flex items-center">
                                            <ChevronDownIcon
                                                className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Disclosure.Button>
                                </dt>
                                <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                    {
                                        typeof section.content === 'string' ? (
                                            <p className="text-base text-gray-500">{section.content}</p>
                                        ) : (
                                            <>{section.content}</>
                                        )
                                    }
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </dl>
        </div>
    )
}

function ExampleImageAndMetadata(): JSX.Element {
    const name = "Business Doge";
    const metadata = JSON.stringify({
        "name": name,
        "description": "The doges living immutably on Ethereum and Arweave have come to take over the metaverse!",
        "image": exampleImage,
        "attributes": [
            {
                "trait_type": "Favorite Color",
                "value": "Black"
            },
            {
                "trait_type": "Cuteness Level",
                "value": "Too much"
            },
            {
                "trait_type": "Fur Type",
                "value": "Sharp"
            }
        ]
    },
        null, 2)
    return (
        <>
            <figure>
                <Image
                    className="w-full rounded-lg"
                    src={exampleImage}
                    alt={name}
                    height={200}
                    width={270}
                />
            </figure>
            <figure className='text-sm'>
                <JsonDisplay
                    src={JSON.parse(metadata)}
                />
            </figure>
        </>
    )
}

function ExampleFileStructure(): JSX.Element {
    const display =
        `images/
├─ 1.jpeg
├─ 2.jpeg
├─ 3.jpeg
├─ ...
metadata/
├─ 1.json
├─ 2.json
├─ 3.json
├─ ...
`
    return (
        <figure className='text-left not-prose'>
            <CodeBlock
                text={display}
                language={'text'}
                theme={dracula}
                showLineNumbers={false}
            />
            <figcaption><i>Both recommended metadata generators will output this file structure.</i></figcaption>
        </figure>
    )
}

const downloadExample = () => {
    console.log('example downloading...');
}

const HowItWorks = () => {
    return (
        <div className=''>
            <h1 className='text-xl text-center font-bold mb-4'>Arweave Uploading: How it Works</h1>
            <hr className='mt-4' />
            <h2 className='text-lg text-center font-semibold mb-2'>What an NFT actually is</h2>
            <p>
                Because it takes so much money to store data on chains like Ethereum, an NFT is mostly
                just a URL pointer (called the <code>TokenURI</code>) to the NFT&apos;s information, called the <code>metadata</code>.
                Within this metadata is another URL pointing to where the image is stored.
            </p>
            <hr className='mt-4' />
            <h2 className='text-lg text-center font-semibold mt-2 mb-2'>What is Arweave and why use it for NFTs?</h2>
            <p>
                <a
                    className='underline text-blue-600 visited:text-purple-600'
                    href="https://www.arweave.org/"
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Arweave
                </a>
                &nbsp;is a permanent storage blockchain where you can pay once and expect
                your data to exist forever. For these reasons it is the perfect place to store
                our NFT data whenever we use chains like Ethereum for our NFTs.
            </p>
            <hr className='mt-4' />
            <h2 className='text-lg text-center font-semibold mt-2 mb-2'>Creating your images and metadata</h2>
            <p>
                Here&apos;s an example of an image and its associated metadata that could be used when creating an NFT:
            </p>
            <ExampleImageAndMetadata />
            <p className='mt-4'>
                Before uploading your metadata, make sure it complies with&nbsp;
                <a href="https://docs.opensea.io/docs/metadata-standards" target='_blank' rel="noreferrer" className="text-blue-600 visited:text-purple-600">
                    OpenSea&apos;s Metadata Standards
                </a>
                &nbsp;if your NFTs will be on Ethereum or Polygon.
            </p>
            <br />
            <p>
                Your images and metadata should have the following file structure:
            </p>
            <ExampleFileStructure />
            <p className='mt-4'>
                <strong>The files should be in order.</strong> The first image file will be matched with the
                first metadata file and uploaded together. The best way to do this is to name them by incrementing
                number. However it is not required to have any specific names for your folders or files
                when you upload them using this tool.
            </p>
            <hr className='mt-4' />
            <h2 className='text-lg text-center font-semibold mt-2 mb-2'>Sample images and metadata</h2>
            <p>Want to play around with some images and metadata that already work?</p>
            {/* NOTE: can't figure out how to get the download for zip files working */}
            <NextLink
                href={''}
                target="_blank"
            >
                <button
                    type="button"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={downloadExample}
                >
                    Download example files
                </button>
            </NextLink>
            <hr className='mt-4' />
            <h2 className='text-lg text-center font-semibold mt-2 mb-2'>The result of the upload</h2>
            <p>
                When the upload finishes, you&apos;ll get two things:
                {/* <ul className='m-2'>
                    <li>
                        A <code>baseURI</code> that looks something like:
                        <br />
                        <code>{exampleMetadataBaseURI}</code>
                    </li>
                    <li>
                        A list of file names that look like:
                        <br />
                        <code>{exampleMetadataFileNames}</code>
                    </li>
                </ul> */}
                They can be put together to form the <code>TokenURI</code> of that NFT. Try it out:
                <br />
                <a
                    className='underline text-blue-600 visited:text-purple-600'
                    href={exampleMetadataLink}
                    target='_blank'
                    rel="noreferrer"
                >
                    {exampleMetadataLink}
                </a>
                <br />
                Dealing with <code>TokenURI</code>s like this can lead to gas optimizations in your smart contract.
            </p>
            <hr className='mt-4' />
            <h2 className='text-lg text-center font-semibold mt-2 mb-2'>Ready to begin?</h2>
            {/* NOTE: the following link should nav back to the project page if user is signed in */}
            <NextLink
                href='/arweave'
                target="_blank"
            >
                <button
                    type="button"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={downloadExample}
                >
                    Upload Now
                </button>
            </NextLink>
            <br />
            <br />
            <br />
            <br />
            <br />




            <div className="relative py-16 bg-white overflow-hidden">
                <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
                    <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
                        <svg
                            className="absolute top-12 left-full transform translate-x-32"
                            width={404}
                            height={384}
                            fill="none"
                            viewBox="0 0 404 384"
                        >
                            <defs>
                                <pattern
                                    id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
                        </svg>
                        <svg
                            className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
                            width={404}
                            height={384}
                            fill="none"
                            viewBox="0 0 404 384"
                        >
                            <defs>
                                <pattern
                                    id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
                        </svg>
                        <svg
                            className="absolute bottom-12 left-full transform translate-x-32"
                            width={404}
                            height={384}
                            fill="none"
                            viewBox="0 0 404 384"
                        >
                            <defs>
                                <pattern
                                    id="d3eb07ae-5182-43e6-857d-35c643af9034"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={384} fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
                        </svg>
                    </div>
                </div>
                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="text-lg max-w-prose mx-auto">
                        <h1>
                            <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                                Uploading to Arweave
                            </span>
                            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                How it Works
                            </span>
                        </h1>
                    </div>
                    <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
                        <p>
                            <a href="https://www.arweave.org/" target='_blank' rel="noreferrer">Arweave</a> is
                            a decentralized storage network that seeks to offer a platform for the <strong>indefinite</strong> storage of data.
                        </p>
                        <p>
                            Arweave's major benefits:
                        </p>
                        <ul role="list">
                            <li>Upfront payment that guarantees the permanent storage of any type of file</li>
                            <li>Files are accessible through traditional web browsers and blockchains</li>
                            <li>Files are free to view - no special wallet or service is needed</li>
                        </ul>
                        <p>
                            However, there can be a steep learning curve for interacting with Arweave and it is usually done just once per project.
                            That's why using a tool like this makes it easy to reliably "set it and forget it" with your decentralized file storage.
                        </p>
                        <h2>Uploading files (for non-NFT use cases)</h2>
                        <Accordion sectionList={uploadingFilesContent} />
                        <h2>Uploading NFT assets</h2>
                        <Accordion sectionList={uploadingNFTsContent} />
                        <h2>Ready to begin?</h2>
                        <p>
                            <a href="/arweave">Upload now</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;