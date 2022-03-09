import type { AppProps } from 'next/app'
import { CheckIcon } from '@heroicons/react/outline'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { CopyBlock, dracula } from "react-code-blocks";

type UploadResultProps = {
    baseURI: string,
    fileNames: string[]
}

function UploadResultDisplay(props: UploadResultProps) {
    let display = 'const baseURI = "' + props.baseURI + '";\n';
    display = display.concat('const metadataFileNames = [\n');
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
        <div className='mt-4 w-3/4'>
            <CopyBlock
                text={display}
                language={'javascript'}
                theme={dracula}
            />
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
                        <p className="text-sm text-gray-500">
                            Use the metadata URIs in your application. Paste one in the browser to see what metadata gets returned.
                        </p>
                    </div>
                </div>
                <UploadResultDisplay baseURI={baseURI} fileNames={fileNames} />
            </main>
        </div>
    )
}
