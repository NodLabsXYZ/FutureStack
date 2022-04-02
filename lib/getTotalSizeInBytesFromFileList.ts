import { FileWithPreview } from "../types/FileWithPreview";

const getTotalSizeInBytesFromFileList = (files: File[] | FileWithPreview[]): number => {
    let totalBytes = 0;
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        totalBytes += file.size;
    }
    return totalBytes;
}

export default getTotalSizeInBytesFromFileList;