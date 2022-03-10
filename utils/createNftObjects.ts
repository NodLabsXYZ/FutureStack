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
    // Getting the JSON from the uploaded metadata file is done on the server because React
    // doesn't have access to 'fs'. I couldn't find a way for the client to open and read the submitted JSON files.
    const metadata = await getJsonFromFile(metadataFile);

    const nftObj: NftObject = {
        imageFile,
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
