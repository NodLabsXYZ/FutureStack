import { FileWithPreview } from "./FileWithPreview";

export type NftObject = {
    imageFile: FileWithPreview
    buffer: Buffer
    imageContentType: string
    metadata: string
}

export type FileToUpload = {
    file: FileWithPreview
    buffer: Buffer
    contentType: string
}
