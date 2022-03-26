import { FileWithPreview } from "../../types/FileWithPreview"
import { formatBytes } from "../../lib/formatters"

type FileListDisplayProps = {
    files: FileWithPreview[]
}

export const FileListDisplay = (props: FileListDisplayProps): JSX.Element => {
    if (props.files.length <= 0) {
        return <></>
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Size
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.files.slice(0, 12).map((file, fileIdx) => (
                                    <tr key={file.name} className={fileIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatBytes(file.size)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {props.files.length > 12 && (
                        <div className="p-6">
                            Plus {props.files.length - 12} more files...
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}
