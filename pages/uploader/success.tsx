import type { AppProps } from 'next/app'
import { CheckIcon } from '@heroicons/react/outline'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { CopyBlock, dracula } from "react-code-blocks";

type UploadResultDisplayProps = {
    baseURI: string,
    fileNames: string[]
}

type BaseUrlDisplayProps = {
    baseURI: string
}

type MetadataFileNamesDisplayProps = {
    fileNames: string[]
}

function BaseUriDisplay(props: BaseUrlDisplayProps): JSX.Element {
    let display = 'const baseURI = "' + props.baseURI + '";\n';
    return (
        <div className='mt-4'>
            <CopyBlock
                text={display}
                language={'javascript'}
                theme={dracula}
            />
        </div>
    )
}

function MetadataFileNamesDisplay(props: MetadataFileNamesDisplayProps): JSX.Element {
    let display = 'const metadataFileNames = [\n';
    const elementList = [];
    for (let index = 0; index < props.fileNames.length; index++) {
        const fileName = props.fileNames[index]
        const isNotOnLastElement = index !== props.fileNames.length - 1
        if (isNotOnLastElement) {
            display = display.concat('    "' + fileName + '"' + ',\n');
        } else {
            // Don't add comma to last element
            display = display.concat('    "' + fileName + '"' + '\n');
        }
    }
    display = display.concat('];');
    return (
        <div className='mt-4'>
            <CopyBlock
                text={display}
                language={'javascript'}
                theme={dracula}
            />
        </div>
    )
}

function ContractTokenUriDisplay(): JSX.Element {
    let display = 
`function tokenURI(uint256 tokenId) public view returns (string memory) {
    return abi.encodePacked(_baseURI() + tokenId + ".json");
}`;
    return (
        <div className='mt-4'>
            <code>YourContract.sol</code>
            <CopyBlock
                text={display}
                language={'javascript'}
                theme={dracula}
                codeBlock
            />
        </div>
    )
}

function UploadResultDisplay(props: UploadResultDisplayProps): JSX.Element {
    const exampleMetadataURI = props.baseURI + props.fileNames[0];
    return (
        <div className='mt-4  w-2/3 left-1/3'>
            <p className="text-m mt-2 text-center">
                This is the base URI you&apos;ll use in your contract.
            </p>
            <BaseUriDisplay baseURI={props.baseURI} />
            <br />
            <p className="text-m mt-2 text-center">
                These are the file names that, when appended to the end of the base URI,
                will return the metadata for that token.
            </p>
            <MetadataFileNamesDisplay fileNames={props.fileNames} />
            <p className="text-m mt-2 text-center">
                Test it out here:
                <br />
                <a
                    className='underline text-blue-600 visited:text-purple-600'
                    href={exampleMetadataURI}
                    target='_blank'
                    rel="noreferrer"
                >
                    {exampleMetadataURI}
                </a>
            </p>
            <br />
            <p className="text-m mt-2 text-center">
                You can easily and gas-efficiently return these values in the contract without
                needing to take any information about the new token from your UI when minting.
                All you need to do is:
            </p>
            <ContractTokenUriDisplay />
        </div>
    )
}

export default function Success({ Component, pageProps }: AppProps) {
    const [baseURI, setBaseURI] = useState<string>();
    const [fileNames, setFileNames] = useState<string[]>([]);
    useEffect(() => {
        if (window) {
            const baseURIFromLocal = localStorage.getItem('baseURI');
            setBaseURI(baseURIFromLocal);
            const metadataFileNames = localStorage.getItem('metadataFileNames');
            if (metadataFileNames) {
                const fileNameArray = metadataFileNames.split(',');
                setFileNames(fileNameArray);
            }
        }
    }, []);
    return (
        <div>
            <main className={styles.main}>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Upload Successful
                    </h3>
                    <div className="mt-2">

                    </div>
                </div>
                <UploadResultDisplay baseURI={baseURI} fileNames={fileNames} />
            </main>
        </div>
    )
}
