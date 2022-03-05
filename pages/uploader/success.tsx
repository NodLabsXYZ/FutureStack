import type { AppProps } from 'next/app'
import { CheckIcon } from '@heroicons/react/outline'
import Header from '../../components/uploader/header'
import Footer from '../../components/uploader/footer'
import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { CopyBlock, dracula } from "react-code-blocks";

type UriDisplayProps = {
    uris: string[]
}

function UriDisplay(props: UriDisplayProps) {
    let display = 'const metadataURIs = [\n';
    const elementList = [];
    for (let index = 0; index < props.uris.length; index++) {
        const uri = props.uris[index]
        const isNotOnLastElement = index !== props.uris.length - 1
        if (isNotOnLastElement) {
            display = display.concat('"' + uri + '"' + ',\n');
        } else {
            // Don't add comma to last element
            display = display.concat('"' + uri + '"' + '\n');
        }
    }
    display = display.concat(']');

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

export default function Success({ Component, pageProps }: AppProps) {
    const [uris, setUris] = useState<string[]>([]);
    useEffect(() => {
        if (window) {
            const urisFromSession = localStorage.getItem('metadataUris');
            if (urisFromSession) {
                const uriArray = urisFromSession.split(',');
                setUris(uriArray);
            }
        }
    }, []);
    return (
        <>
            <Header />

            <main className={styles.main}>
                <div>
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
                    <UriDisplay uris={uris} />
                </div>
            </main>

            {/* <Footer /> */}
        </>
    )
}
