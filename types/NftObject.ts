import { FileWithPreview } from "./FileWithPreview";

export type NftObject = {
    imageFile: FileWithPreview,
    metadataFile: File,
    name: string,
    preview: string,
    metadata: string
}