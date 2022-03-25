import type { AppProps } from 'next/app'
import { CheckIcon } from '@heroicons/react/outline'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { CopyBlock, dracula } from "react-code-blocks";
import store from 'store2';
import { StoreName } from '../../enums/storeEnums';
import { updateSurvey } from '../../lib/queries';
import { TWButton } from '../../components';
import { supabaseClient } from '../../lib';
import { ApiError } from 'next/dist/server/api-utils';

type UploadResultDisplayProps = {
    baseURI: string,
    fileNames: string[]
}

type BaseUrlDisplayProps = {
    baseURI: string
}

type MetadataFileNamesDisplayProps = {
    baseURI: string,
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
            display = display.concat('  "' + props.baseURI + fileName + '"' + ',\n');
        } else {
            // Don't add comma to last element
            display = display.concat('  "' + props.baseURI + fileName + '"' + '\n');
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

function UploadedFilesFullUriDisplay(props: UploadResultDisplayProps): JSX.Element {
    let display = '';
    const elementList = [];
    for (let index = 0; index < props.fileNames.length; index++) {
        const fileName = props.fileNames[index]
        display = display.concat(fileName + '\n');
    }
    return (
        <div className='mt-4'>
            <CopyBlock
                text={display}
                language={'text'}
                theme={dracula}
            />
        </div>
    )
}

function NftUploadResultDisplay(props: UploadResultDisplayProps): JSX.Element {
    const exampleMetadataURI = props.baseURI + props.fileNames[0];
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<any|undefined>();

    const onClick = async () => {
        let { user, error } = await supabaseClient.auth.signIn({
            email: email
        })
    
        setError(error);
        
        if (!error) {
            setSent(true)
        }
    }

    return (
        <div className=' w-2/3 left-1/3'>
            <p className='my-6 text-center'>
                Please save this information somewhere as it is hard to recover if you lose it.
            </p>

            <div className='pb-3 w-3/4 mx-auto text-center'>
                Or you can enter your email and we&apos;ll create a dashboard for all of your uploads.
                {sent && (
                    <div className='py-3'>
                        An email was sent to you to complete your registration.
                    </div>
                )}
                {error && (
                    <div className='py-3 text-red-600'>
                        {error.message}
                    </div>
                )}
                <div className='py-3'>
                    <input
                        type='text'
                        className='w-2/3 mr-3 border px-3 py-1 mb-3 text-slate-900'
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        value={email}
                    />
                    <TWButton
                        onClick={onClick}
                    >
                        Register
                    </TWButton>
                </div>
            </div>
            
            <p className="text-m mb-3 text-center">
                This is the base URI you&apos;ll use in your contract.
            </p>
            <BaseUriDisplay baseURI={props.baseURI} />
            <br />
            
            <p className="text-m mb-3 text-center">
                Each individual metadata file is available at the base URI above + the index of the file.
            </p>
            <MetadataFileNamesDisplay baseURI={props.baseURI} fileNames={props.fileNames} />
            <p className="text-m mt-3 text-center">
                Test it out here:
                <br />
                <a
                    className='underline text-blue-600 visited:text-purple-600'
                    href={exampleMetadataURI}
                    target='_blank'
                    rel="noopener noreferrer"
                >
                    {exampleMetadataURI}
                </a>
            </p>
            <br />
            
            {/* <p className="text-m mt-2 text-center">
                You can easily and gas-efficiently return these values in the contract without
                needing to take any information about the new token from your UI when minting.
                All you need to do is:
            </p>
            <div className='mt-4'>
                <ContractTokenUriDisplay />
            </div> */}
        
        </div>
    )
}

function FileUploadResultDisplay(props: UploadResultDisplayProps): JSX.Element {
    const exampleFileURI = props.fileNames[0];
    return (
        <div className='mt-4  w-2/3 left-1/3'>
            <p className="text-m mt-2 text-center">
                Here are the links to your files hosted permanently on Arweave:
            </p>
            <UploadedFilesFullUriDisplay baseURI={props.baseURI} fileNames={props.fileNames} />
            <p className="text-m mt-2 text-center">
                To view, just paste them into your browser. Test one out here:
                <br />
                <a
                    className='underline text-blue-600 visited:text-purple-600'
                    href={exampleFileURI}
                    target='_blank'
                    rel="noopener noreferrer"
                >
                    {exampleFileURI}
                </a>
            </p>
        </div>
    )
}

export default function UploadSuccess({ Component, pageProps }: AppProps) {
    const surveyStore = store.namespace(StoreName.survey);
    const [baseURI, setBaseURI] = useState<string>();
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [uploadType, setUploadType] = useState<StoreName>();

    useEffect(() => {
        if (window) {
            const generalUploaderStore = store.namespace(StoreName.generalUploader);
            const baseURIFromLocal = generalUploaderStore('baseURI');
            setBaseURI(baseURIFromLocal);
            const metadataFileNames = generalUploaderStore('metadataFileNames');
            if (metadataFileNames) {
                const fileNameArray = metadataFileNames.split(',');
                setFileNames(fileNameArray);
            }
            const uploadTypeFromLocal = generalUploaderStore('lastSuccessfulUpload');
            setUploadType(uploadTypeFromLocal);
        }
    }, []);

    useEffect(() => {
        const survey = surveyStore('arweave');
        if (survey) {
            survey.results.claimedAt = new Date().toISOString();
            updateSurvey(survey.id, survey);
            surveyStore('arweave', survey);
        }
    }, [surveyStore])

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
                {
                    uploadType === StoreName.nftUploader ? (
                        <NftUploadResultDisplay baseURI={baseURI} fileNames={fileNames} />
                    ) : (
                        <FileUploadResultDisplay baseURI={baseURI} fileNames={fileNames} />
                    )
                }
            </main>
        </div>
    )
}
