import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable';
import { existsSync, mkdirSync, renameSync, writeFileSync, rmSync, createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { estimatePriceForDirInAtomicUnits, getBaseURIFromFile, getFileNamesFromManifest, getURIsFromParentTxn, uploadFolderToBundlr } from "../../../utils/bundlr";
import { BUNDLR, TEMP_DIR } from '../../../utils/bundlrConfig';
import Bundlr from '@bundlr-network/client/build/common/bundlr';
import { serverPath } from '../../../utils/constants';
import { TempFileData } from '../../../types/TempData';
import request from 'request';

// disable body parser for file reading
export const config = {
    api: {
        bodyParser: false,
    }
};

type FileToUpload = {
    clientTempFilePath: string,
    serverTempFilePath: string,
    fileName: string,
}

type Data = {
    baseURI: string,
    metadataFileNames: string[]
}

const uploadFilesToBundlr = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    // Create ID for temp folder with images and metadata
    const tempId = uuidv4();

    // Create temp dirs with tempId
    createDir(TEMP_DIR);
    const parentTempDirForThisUpload = TEMP_DIR + tempId;
    createDir(parentTempDirForThisUpload);

    // A copy of the manifest and bulk txn id get created after Bundlr completes
    const manifestPath = TEMP_DIR + '/' + tempId + '-manifest.json';
    const bundleTxnIdPath = TEMP_DIR + '/' + tempId + '-id.txt';

    // Read files from request
    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    const filesToUpload = getTempFileObjects(data.fields, tempId);

    moveFilesToTempDir(filesToUpload);

    await fundBundlrAccountIfNecessary(BUNDLR, parentTempDirForThisUpload);

    await uploadFolderToBundlr(BUNDLR, parentTempDirForThisUpload);

    const baseURI = getBaseURIFromFile(bundleTxnIdPath);
    const metadataFileNames = getFileNamesFromManifest(manifestPath);

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

function getTempFileObjects(dataFields: any, tempId: string): FileToUpload[] {
    const tempFileStrings: string[] = Object.values(dataFields);
    const filesToUpload = [];
    for (let index = 0; index < tempFileStrings.length; index++) {
        const rawFileObject: TempFileData = JSON.parse(tempFileStrings[index]);
        const clientTempFilePath = rawFileObject.clientTempFilePath;

        const fileName = rawFileObject.fileName;
        const serverTempFilePath = TEMP_DIR + tempId + '/' + fileName;

        const fileToUpload: FileToUpload = {
            clientTempFilePath,
            serverTempFilePath,
            fileName,
        }
        filesToUpload.push(fileToUpload);
    }
    return filesToUpload;
}

function moveFilesToTempDir(filesToUpload: FileToUpload[]) {
    for (let index = 0; index < filesToUpload.length; index++) {
        const tempNftObject = filesToUpload[index];
        renameSync(
            tempNftObject.clientTempFilePath,
            tempNftObject.serverTempFilePath
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

export default uploadFilesToBundlr;
