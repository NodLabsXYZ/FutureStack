import React from 'react';
import NextLink from '../../components/NextLink';
import styles from '../../styles/Home.module.css'
import { CodeBlock, dracula } from "react-code-blocks";

// This is to fix 'document not found' error from the react-json-view package
// const ReactJson = React.lazy(() => import('react-json-view'));

const exampleImageBaseURI = 'https://arweave.net/cvToh8C_sM9FYhGcpWqSAOLJqO2Anv6V4QXtT3VOLh4/';
const exampleFileName = '1.jpg';
const exampleImage = exampleImageBaseURI + exampleFileName;
const exampleMetadataBaseURI = 'https://arweave.net/HgSjSaOKq2mTSLvNb_2b224fA-r86z6Ogi0xTOWKaio/';
const exampleMetadataFileNames = "['0.json', '1.json', '2.json', ...]"
const exampleMetadataLink = exampleMetadataBaseURI + '0.json';
// const exampleFiles = window.URL.createObjectURL(new Blob[])

// const fileToDataUri = (file) => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       resolve(event.target.result)
//     };
//     reader.readAsDataURL(file);
//     })

const PrettyPrintJson = ({ data }) => (<div><pre>{
    JSON.stringify(data, null, 2)}</pre></div>);

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
        <div className='mt-4'>
            <img className="w-80 ml-60 flex-shrink-0 mx-10 rounded-lg" src={exampleImage} alt={name} />
            <div>
                <div className='mt-4 text-left'>
                    {/* <ReactJson
                        src={JSON.parse(metadata)}
                        theme="bright:inverted"
                        displayObjectSize={false}
                        displayDataTypes={false}
                        enableClipboard={false}
                    /> */}
                    <CodeBlock
                        text={metadata}
                        language={'javascript'}
                        theme={dracula}
                        showLineNumbers={false}
                    />

                </div>
            </div>
        </div>
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
        <div className='mt-4 text-left'>
            <CodeBlock
                text={display}
                language={'text'}
                theme={dracula}
                showLineNumbers={false}
            />
        </div>
    )
}

const downloadExample = () => {
    console.log('example downloading...');
}

export default function HowItWorks(): JSX.Element {
    return (
        <main className={styles.main}>
            <div className='w-2/3 text-center'>
                <h1 className='text-xl text-center font-bold mb-4'>Arweave Uploading: How it Works</h1>
                <hr className='mt-4' />
                <h2 className='text-lg text-center font-semibold mb-2'>What an NFT actually is</h2>
                <p>
                    Because it takes so much money to store data on chains like Ethereum, an NFT is mostly
                    just a URL pointer (called the <code>TokenURI</code>) to the NFT's information, called the <code>metadata</code>.
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
                    Here's an example of an image and its associated metadata that could be used when creating an NFT:
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
                    When the upload finishes, you'll get two things:
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
            </div>
        </main>
    )
}