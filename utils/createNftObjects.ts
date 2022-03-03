import { FileWithPreview } from "../types/FileWithPreview";
import { NftObject } from "../types/NftObject";

export const createNftObjects = async (imageFiles: FileWithPreview[], metadataFiles: File[]): Promise<NftObject[]> => {
    if (imageFiles.length !== metadataFiles.length) {
        throw new Error("There must be the same number of image and metadata files.");
    }

    const nftObjects: NftObject[] = [];

    for (let index = 0; index < imageFiles.length; index++) {
        const imageFile = imageFiles[index];
        const metadataFile = metadataFiles[index];

        const nftObject = await createNftObject(imageFile, metadataFile);

        nftObjects.push(nftObject);
    }

    return nftObjects;
}

const createNftObject = async (imageFile: FileWithPreview, metadataFile: File) => {
    const metadata = await getJsonFromFile(metadataFile);

    const name = metadata.name;

    if (!name) {
        throw new Error("Metadata needs a 'name' property.");
    }

    const nftObj: NftObject = {
        imageFile,
        metadataFile,
        name,
        preview: imageFile.preview,
        metadata: JSON.stringify(metadata)
    }

    return nftObj;
}

const getJsonFromFile = async (metadataFile: File) => {
    const formData = new FormData();

    formData.append(metadataFile.name, metadataFile);

    const options = {
        method: 'POST',
        body: formData
    }

    const response = await fetch('/api/uploader/getJson', options);

    const { json } = await response.json();

    console.log('json :>> ', json);

    return json;
}