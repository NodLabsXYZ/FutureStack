import { FileWithPreview } from "../types/FileWithPreview";
import { SeparateImageAndMetadataFilesResult } from "../types/SeparateImageAndMetadataFilesResult";
import getFilesOfTypeFromList from "./getFilesOfTypeFromList";

const separateImageAndMetadataFiles = (files: FileWithPreview[]): SeparateImageAndMetadataFilesResult => {
    const metadataFiles = getFilesOfTypeFromList('json', files) as FileWithPreview[];
    const imageFiles = files.filter(file => !metadataFiles.includes(file));

    const result: SeparateImageAndMetadataFilesResult = {
        imageFiles,
        metadataFiles
    }
    return result;
}

export default separateImageAndMetadataFiles;