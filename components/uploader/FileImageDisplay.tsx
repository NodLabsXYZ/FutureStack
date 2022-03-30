import Image from 'next/image'
import { FileWithPreview } from "../../types/FileWithPreview"
import { DocumentTextIcon } from '@heroicons/react/outline'
import { fileHasVisualPreview } from '../../lib'

type FileImageDisplayProps = {
    file: FileWithPreview,
    height: number
}

export default function FileImageDisplay(props: FileImageDisplayProps): JSX.Element {
    if (fileHasVisualPreview(props.file.name)) {
        return (
            <Image
                src={props.file.preview}
                alt={props.file.name}
                className="object-cover pointer-events-none border rounded"
                layout="intrinsic"
                height={props.height}
                width={props.height}
            />
        )
    }

    return (
        <DocumentTextIcon height={props.height} />
    )
}
