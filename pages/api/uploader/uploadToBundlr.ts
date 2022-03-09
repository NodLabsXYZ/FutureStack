import type { NextApiRequest, NextApiResponse } from 'next'
import Bundlr from '@bundlr-network/client';
import { IncomingForm } from 'formidable';
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { estimatePriceForDirInAtomicUnits, getBaseURIFromFile, getBundlrBalance, getFileNamesFromManifest, getURIsFromParentTxn, uploadFolderToBundlr } from "../../../utils/bundlr";

// disable body parser for file reading
export const config = {
    api: {
        bodyParser: false,
    }
};

type TempNftObject = {
    clientTempImagePath: string,
    serverTempImagePath: string,
    fileName: string,
    metadata: any
}

type Data = {
    baseURI: string,
    metadataFileNames: string[]
}

// Extract to constants

const tempDir = 'tempNftData/'
const bundlrNetworkUrl = 'https://node1.bundlr.network/'
const currency = 'solana'

if (process.env["SOL_PRIVATE_KEY"] === '' || !process.env["SOL_PRIVATE_KEY"]) {
    throw new Error("No SOL_PRIVATE_KEY. Set SOL_PRIVATE_KEY environment variable.");
}
const key = process.env["SOL_PRIVATE_KEY"];
// const currency = 'arweave'

// if (process.env["ARWEAVE_KEY"] === '' || !process.env["ARWEAVE_KEY"]) {
//     throw new Error("No ARWEAVE_KEY. Set ARWEAVE_KEY environment variable.");
// }
// const key = JSON.parse(process.env["ARWEAVE_KEY"]);

const bundlr = new Bundlr(bundlrNetworkUrl, currency, key);

export default async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    const bundlrAddress = bundlr.address;
    console.log('bundlrAddress :>> ', bundlrAddress);

    // Create ID for temp folder with images and metadata
    const tempId = uuidv4();

    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    console.log('data :>> ', data);

    const nftObjectIds = [];
    for (const nftObjectId in data.fields) {
        if (Object.prototype.hasOwnProperty.call(data.fields, nftObjectId)) {
            nftObjectIds.push(+nftObjectId);
        }
    }
    nftObjectIds.sort();

    // Create TempNftObjects
    const tempNftObjects = [];
    for (let index = 0; index < nftObjectIds.length; index++) {
        const nftObjectString = data.fields[nftObjectIds[index]];
        const rawNftObject = JSON.parse(nftObjectString);

        const clientTempImagePath = rawNftObject.clientTempFilePath

        const fileName = rawNftObject.imageFileName;
        const serverTempImagePath = tempDir + tempId + '/images/' + fileName

        const metadata = JSON.parse(rawNftObject.metadata);


        const tempNftObject: TempNftObject = {
            clientTempImagePath,
            serverTempImagePath,
            fileName,
            metadata
        }
        tempNftObjects.push(tempNftObject);
    }


    console.log('tempNftObjects :>> ', tempNftObjects);

    // Sort metadata strings
    // const metadataIds = [];
    // for (const metadata in data.fields) {
    //     if (Object.prototype.hasOwnProperty.call(data.fields, metadata)) {
    //         metadataIds.push(metadata);
    //     }
    // }
    // metadataIds.sort();


    // // Sort image files
    // const fileIds = [];
    // for (const file in data.files) {
    //     if (Object.prototype.hasOwnProperty.call(data.files, file)) {
    //         fileIds.push(file);
    //     }
    // }
    // fileIds.sort();

    // // get clientImagePaths
    // const imageClientTempPaths: string[] = [];
    // for (let index = 0; index < fileIds.length; index++) {
    //     const file = data.files[fileIds[index]];
    //     imageClientTempPaths.push(file.filepath);
    // }


    // // Create TempNftObjects
    // const numberOfItemsToUpload = imageClientTempPaths.length;
    // const tempNftObjects: TempNftObject[] = [];
    // for (let index = 0; index < numberOfItemsToUpload; index++) {
    //     const clientTempImagePath = imageClientTempPaths[index]
    //     const fileId = fileIds[index];

    //     const imageFileName = data.files[fileId].originalFilename;
    //     const serverTempImagePath = tempDir + tempId + '/images/' + imageFileName

    //     const metadataId = metadataIds[index]
    //     const metadata = JSON.parse(data.fields[metadataId]);


    //     const tempNftObject: TempNftObject = {
    //         clientTempImagePath,
    //         serverTempImagePath,
    //         metadata
    //     }
    //     tempNftObjects.push(tempNftObject);
    // }

    // Create temp dir with tempId
    const parentTempDirForThisUpload = tempDir + tempId;
    createDir(parentTempDirForThisUpload);
    const imageTempDirForThisUpload = parentTempDirForThisUpload + '/images';
    createDir(imageTempDirForThisUpload);
    const metadataTemptDirForThisUpload = parentTempDirForThisUpload + '/metadata';
    createDir(metadataTemptDirForThisUpload);

    // Move to unified directory
    for (let index = 0; index < tempNftObjects.length; index++) {
        const tempNftObject = tempNftObjects[index];
        renameSync(
            tempNftObject.clientTempImagePath,
            tempNftObject.serverTempImagePath
        );
    }

    // If bundlr account does not have anough AR, fund it
    const estimatedPriceBN = await estimatePriceForDirInAtomicUnits(bundlr, imageTempDirForThisUpload);
    const estimatedPrice = estimatedPriceBN.toNumber();
    const balance = await getBundlrBalance(bundlr);
    console.log('loadedBalance :>> ', balance);

    if (estimatedPrice >= balance) {
        console.log('=====================');
        console.log('Loaded balance not enough. Funding...');
        const fundAmount = Math.ceil((estimatedPrice - balance) * 1.1); // A little extra just in case. Also must be an int
        await bundlr.fund(fundAmount);
        console.log('💲 Funding Complete 💲');
        console.log('fundAmount :>> ', fundAmount);
        console.log('=====================');
    }

    // Upload image dir to Bundlr
    await uploadFolderToBundlr(bundlr, imageTempDirForThisUpload);
    // A copy of the manifest has been written to tempNftData\<tempId>\images-manifest.json
    // A copy of the bulk txnId has been written to tempNftData\<tempId>\images-id.txt

    const imageManifestPath = parentTempDirForThisUpload + '/images-manifest.json';
    const imageBulkTxnIdPath = parentTempDirForThisUpload + '/images-id.txt';

    // Add newly created imageURIs to metadata and create JSON file to upload
    const imageURIs = await getURIsFromParentTxn(imageBulkTxnIdPath, imageManifestPath);
    for (let index = 0; index < tempNftObjects.length; index++) {
        const tempNftObject = tempNftObjects[index];
        tempNftObject.metadata.image = imageURIs[index];
        const metadataFilePath = metadataTemptDirForThisUpload + '/' + index + '.json';
        const metadataString = JSON.stringify(tempNftObject.metadata);
        writeFileSync(metadataFilePath, metadataString, 'utf-8');
    }

    // Upload metadata
    await uploadFolderToBundlr(bundlr, metadataTemptDirForThisUpload);
    const metadataManifestPath = parentTempDirForThisUpload + '/metadata-manifest.json';
    const metadataBulkTxnIdPath = parentTempDirForThisUpload + '/metadata-id.txt';

    const baseURI = getBaseURIFromFile(metadataBulkTxnIdPath);
    const metadataFileNames = getFileNamesFromManifest(metadataManifestPath);

    console.log('baseURI :>> ', baseURI);
    console.log('metadataFileNames :>> ', metadataFileNames);

    res.status(200).json({ baseURI, metadataFileNames })
}

const createDir = (path: string): void => {
    if (!existsSync(path)) {
        mkdirSync(path);
    }
}