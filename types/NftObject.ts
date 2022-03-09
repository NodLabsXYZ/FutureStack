import { FileWithPreview } from "./FileWithPreview";

export type NftObject = {
    imageFile: FileWithPreview,
    metadata: string
}

export type ArrayBufferNftObject = {
    arrayBufferFile: ArrayBuffer,
    metadata: string
}