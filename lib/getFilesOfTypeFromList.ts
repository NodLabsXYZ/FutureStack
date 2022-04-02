import { FileWithPreview } from "../types/FileWithPreview";
import getFileType from "./getFileType";

const getFilesOfTypeFromList = (fileType: string, files: File[] | FileWithPreview[]): File[] | FileWithPreview[] => {
    const filesOfCorrectType = [];
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        if (getFileType(file.name) === fileType) {
            filesOfCorrectType.push(file);
        }
    }
    return filesOfCorrectType;
}

export default getFilesOfTypeFromList;