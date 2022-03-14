import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable';
import { existsSync, mkdirSync, renameSync, writeFileSync, rmSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { estimatePriceForDirInAtomicUnits, getBaseURIFromFile, getFileNamesFromManifest, getURIsFromParentTxn, uploadFolderToBundlr } from "../../../utils/bundlr";
import { BUNDLR, TEMP_DIR } from '../../../utils/bundlrConfig';
import Bundlr from '@bundlr-network/client/build/common/bundlr';
import { serverPath } from '../../../utils/constants';

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

const uploadNftsToBundlr = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    // Create ID for temp folder with images and metadata
    const tempId = uuidv4();

    // Create temp dirs with tempId
    createDir(TEMP_DIR);
    const parentTempDirForThisUpload = TEMP_DIR + tempId;
    createDir(parentTempDirForThisUpload);
    const imageTempDir = parentTempDirForThisUpload + '/images';
    createDir(imageTempDir);
    const metadataTemptDir = parentTempDirForThisUpload + '/metadata';
    createDir(metadataTemptDir);

    // A copy of the manifest and bulk txn id get created after Bundlr completes
    const imageManifestPath = parentTempDirForThisUpload + '/images-manifest.json';
    const imageBundleTxnIdPath = parentTempDirForThisUpload + '/images-id.txt';
    const metadataManifestPath = parentTempDirForThisUpload + '/metadata-manifest.json';
    const metadataBundleTxnIdPath = parentTempDirForThisUpload + '/metadata-id.txt';

    // Read files from request
    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    const nftObjectIds = getNftObjectIds(data);

    const tempNftObjects = getTempNftObjects(nftObjectIds, data, tempId);

    moveImagesToTempDir(tempNftObjects);

    await fundBundlrAccountIfNecessary(BUNDLR, imageTempDir);

    await uploadFolderToBundlr(BUNDLR, imageTempDir);

    updateMetadataWithImageUriAndSaveAsTempFile(
        imageBundleTxnIdPath,
        imageManifestPath,
        tempNftObjects,
        metadataTemptDir
    );

    await uploadFolderToBundlr(BUNDLR, metadataTemptDir);

    const baseURI = getBaseURIFromFile(metadataBundleTxnIdPath);
    const metadataFileNames = getFileNamesFromManifest(metadataManifestPath);

    console.log('baseURI :>> ', baseURI);
    console.log('metadataFileNames :>> ', metadataFileNames);

    deleteDirAndContents(parentTempDirForThisUpload);

    res.status(200).json({ baseURI, metadataFileNames })
}

const createDir = (path: string): void => {
    if (!existsSync(path)) {
        mkdirSync(path);
    }
}

function deleteDirAndContents(parentTempDir: string): void {
    try {
        rmSync(parentTempDir, { recursive: true });
    } catch (error) {
        console.error(error);
    }
}

function getNftObjectIds(data: any) {
    const nftObjectIds = [];
    for (const nftObjectId in data.fields) {
        if (Object.prototype.hasOwnProperty.call(data.fields, nftObjectId)) {
            nftObjectIds.push(+nftObjectId);
        }
    }
    nftObjectIds.sort();
    return nftObjectIds;
}

function getTempNftObjects(nftObjectIds: string[], data: any, tempId: string): TempNftObject[] {
    const tempNftObjects = [];
    for (let index = 0; index < nftObjectIds.length; index++) {
        const nftObjectString = data.fields[nftObjectIds[index]];
        const rawNftObject = JSON.parse(nftObjectString);

        const clientTempImagePath = rawNftObject.clientTempFilePath;

        const fileName = rawNftObject.imageFileName;
        const serverTempImagePath = TEMP_DIR + tempId + '/images/' + fileName;

        const metadata = JSON.parse(rawNftObject.metadata);


        const tempNftObject: TempNftObject = {
            clientTempImagePath,
            serverTempImagePath,
            fileName,
            metadata
        };
        tempNftObjects.push(tempNftObject);
    }
    return tempNftObjects;
}

function moveImagesToTempDir(tempNftObjects: TempNftObject[]) {
    for (let index = 0; index < tempNftObjects.length; index++) {
        const tempNftObject = tempNftObjects[index];
        renameSync(
            tempNftObject.clientTempImagePath,
            tempNftObject.serverTempImagePath
        );
    }
}

async function fundBundlrAccountIfNecessary(bundlr: Bundlr, imageTempDirForThisUpload: string) {
    const estimatedPriceBN = await estimatePriceForDirInAtomicUnits(bundlr, imageTempDirForThisUpload);
    const estimatedPrice = estimatedPriceBN.toNumber();
    console.log('estimatedPrice :>> ', estimatedPrice);
    const balance = await bundlr.getLoadedBalance().then(bn => bn.toNumber());
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
}

function updateMetadataWithImageUriAndSaveAsTempFile(imageBundleTxnIdPath: string, imageManifestPath: string, tempNftObjects: TempNftObject[], metadataTemptDir: string) {
    const imageURIs = getURIsFromParentTxn(imageBundleTxnIdPath, imageManifestPath);
    for (let index = 0; index < tempNftObjects.length; index++) {
        const tempNftObject = tempNftObjects[index];
        tempNftObject.metadata.image = imageURIs[index];
        const metadataFilePath = metadataTemptDir + '/' + index + '.json';
        const metadataString = JSON.stringify(tempNftObject.metadata);
        writeFileSync(metadataFilePath, metadataString, 'utf-8');
    }
}

export default uploadNftsToBundlr;