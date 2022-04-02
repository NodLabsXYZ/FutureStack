
const getFileType = (fileName: string): string => {
    const fileNameSplit = fileName.split('.')
    return fileNameSplit[fileNameSplit.length - 1];
}

export default getFileType;