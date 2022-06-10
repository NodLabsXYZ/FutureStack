import { FileWithPreview } from "../types/FileWithPreview";
import { NftObject } from "../types/NftObject";

const createNftObjects = async (imageFiles: FileWithPreview[], metadataFiles: File[], onItemProcessed: (index: number) => void): Promise<NftObject[]> => {
    if (imageFiles.length !== metadataFiles.length) {
        throw new Error("There must be the same number of image and metadata files.");
    }

    const nftObjects: NftObject[] = [];

    const sortedImageFiles = imageFiles.sort((a, b) => a.name.localeCompare(b.name));
    const sortedMetadataFiles = metadataFiles.sort((a, b) => a.name.localeCompare(b.name));

    for (let index = 0; index < sortedImageFiles.length; index++) {
        const imageFile = sortedImageFiles[index];
        const metadataFile = sortedMetadataFiles[index];

        const nftObject = await createNftObject(imageFile, metadataFile);

        nftObjects.push(nftObject);
        onItemProcessed(index);
    }

    return nftObjects;
}

const createNftObject = async (imageFile: FileWithPreview, metadataFile: File) => {
    const metadata = await getJsonFromFile(metadataFile);

    const nftObj: NftObject = {
        imageFile,
        buffer: Buffer.from(await imageFile.arrayBuffer()),
        imageContentType: imageFile.type,
        metadata: JSON.stringify(metadata)
    }

    return nftObj;
}

const getJsonFromFile = async (metadataFile: File) => {
    const fileReader = new FileReader();
    fileReader.readAsText(metadataFile);

    const promise = new Promise((resolve, reject) => {
        fileReader.onload = (e) => {
            const json = JSON.parse(fileReader.result as string);
            resolve(json);
        }
    });

    return promise;
}

export default createNftObjects;