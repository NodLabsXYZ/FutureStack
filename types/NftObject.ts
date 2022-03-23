import { FileWithPreview } from "./FileWithPreview";

export type NftObject = {
    imageFile: FileWithPreview,
    buffer: Buffer,
    imageContentType: string
    metadata: string
}
