import getFileType from "./getFileType";

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

const fileHasVisualPreview = (fileName: string): boolean => {
    // Source: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const fileType = getFileType(fileName);

    if (fileTypesWithVisualPreview.includes(fileType)) {
        return true;
    }
    return false
}

export default fileHasVisualPreview;