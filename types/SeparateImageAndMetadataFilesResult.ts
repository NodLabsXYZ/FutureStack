import { FileWithPreview } from "./FileWithPreview"

export type SeparateImageAndMetadataFilesResult = {
    imageFiles: FileWithPreview[],
    metadataFiles: FileWithPreview[]
}