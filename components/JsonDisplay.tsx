/*
    This component is a wrapper for the react-json-view library because
    it has a bug where it errors out on page load because the document
    is not ready
*/

import React, { Suspense } from "react";
import { useEffect, useState } from "react";

type JsonDisplayProps = {
    src: object,
}

export default function JsonDisplay(props: JsonDisplayProps) {
    const [isDocumentReady, setIsDocumentReady] = useState(false);
    useEffect(() => {
        if (window) {
            setIsDocumentReady(true);
        }
    }, []);

    if (!isDocumentReady) {
        return <></>
    }
    
    const ReactJson = React.lazy(() => import('react-json-view'));
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReactJson
                src={props.src}
                theme="bright:inverted"
                displayObjectSize={false}
                displayDataTypes={false}
                enableClipboard={false}
            />
        </Suspense>
    )
}