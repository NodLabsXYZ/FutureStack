import { FileWithPreview } from "../types/FileWithPreview";

export const getFileType = (fileName: string): string => {
    const fileNameSplit = fileName.split('.')
    return fileNameSplit[fileNameSplit.length - 1];
}

export const getFilesOfTypeFromList = (fileType: string, files: File[] | FileWithPreview[]): File[] | FileWithPreview[] => {
    const filesOfCorrectType = [];
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        if (getFileType(file.name) === fileType) {
            filesOfCorrectType.push(file);
        }
    }
    return filesOfCorrectType;
}

export const fileHasVisualPreview = (fileName: string): boolean => {
    // Source: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const fileType = getFileType(fileName);

    if (fileTypesWithVisualPreview.includes(fileType)) {
        return true;
    }
    return false
}

const fileTypesWithVisualPreview = [
    'apng',
    'png',
    'avif',
    'gif',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'svg',
    'webp',
    'ico',
    'cur',
    'tif',
    'tiff',
]