import fs from 'fs';
import util from 'util';
import Bundlr from '@bundlr-network/client';
import { BASE_ARWEAVE_URL } from './constants';

const readFileAsPromise = util.promisify(fs.readFile);

export const getBundlr = (bundlrNetworkUrl, currency, walletKey, rpcUrl) => {
    return new Bundlr.default(bundlrNetworkUrl, currency, walletKey, { providerUrl: rpcUrl });
};

export const getBundlrBalance = async (bundlr) => {
    const balance = await bundlr.getLoadedBalance()
    const amount = bundlr.utils.unitConverter(balance).toNumber();
    return amount;

}

export const estimatePriceForDirInAtomicUnits = async (bundlr, pathToImageDir) => {
    const totalBytes = getDirSize(pathToImageDir);
    return await bundlr.getPrice(totalBytes);
}

export const estimatePriceForDir = async (bundlr, pathToImageDir) => {
    const totalBytes = getDirSize(pathToImageDir);
    const priceForBytes = await bundlr.getPrice(totalBytes);
    const amount = bundlr.utils.unitConverter(priceForBytes).toNumber();
    return amount;
}

export const uploadFolderToBundlr = async (bundlr, imageDir) => {
    // Creates an images-manifest.json files in the /assets directory
    return await bundlr.uploader.uploadFolder(imageDir, null, null, null, (err) => console.error(err));
};

export const uploadMetadata = async (bundlr) => {
    const ids = await getImageTxns();
    const allMetadataString = await readFileAsPromise(pathToMetadataJSON);
    const allMetadata = JSON.parse(allMetadataString);

    const metadataUris = [];
    for (const item in allMetadata) {
        if (Object.hasOwnProperty.call(allMetadata, item)) {
            const metadata = allMetadata[item];
            metadata.image = arweaveBaseUrl + ids.shift();
            const metadataUri = await uploadJsonToBundlr(bundlr, JSON.stringify(metadata));
            metadataUris.push(metadataUri);
        }
    }
    return metadataUris;
};

export const generateOutput = (stringArray) => {
    fs.writeFileSync('output/output.json', JSON.stringify(stringArray));
}

const uploadJsonToBundlr = async (bundlr, metadata) => {
    const tags = [{ name: "Content-Type", value: 'text/json' }];

    const metadataTxn = bundlr.createTransaction(metadata, { tags });

    await metadataTxn.sign();

    const bundlrMetadataResponse = await metadataTxn.upload();

    return arweaveBaseUrl + bundlrMetadataResponse.data.id;
}

const getImageTxns = async () => {
    const jsonString = await readFileAsPromise(pathToImagesManifestJSON);
    try {
        const fileData = JSON.parse(jsonString);
        const paths = fileData.paths;
        let ids = []
        for (const path in paths) {
            if (Object.hasOwnProperty.call(paths, path)) {
                const id = paths[path].id;
                ids.push(id);
            }
        }
        return ids;
    } catch (error) {
        console.error(error);
    }
}

export const getURIsFromParentTxn = (pathToBulkTxnId, pathToManifestJSON) => {
    const baseURI = getBaseURIFromFile(pathToBulkTxnId);
    const fileNames = getFileNamesFromManifest(pathToManifestJSON);
    const uris = [];
    fileNames.forEach(fileName => {
        uris.push(baseURI + fileName);
    });
    return uris;
}

export const getFileNamesFromManifest = (pathToManifestJSON) => {
    const jsonString = fs.readFileSync(pathToManifestJSON);
    try {
        const fileData = JSON.parse(jsonString);
        const paths = fileData.paths;
        return Object.keys(paths);
    } catch (error) {
        console.error(error);
    }

}

export const getBaseURIFromFile = (pathToBulkTxnId) => {
    const txnId = fs.readFileSync(pathToBulkTxnId, 'utf-8');
    return BASE_ARWEAVE_URL + txnId + '/';
}

function getTotalBytesOfImagesAndMetadata(pathToImageDir, metadataJSONpath) {
    let totalBytes = 0;
    totalBytes += getDirSize(pathToImageDir);
    totalBytes += getFileSizeInBytes(metadataJSONpath);
    return totalBytes;
}

function getDirSize(pathToImageDir) {
    const imageFileNames = fs.readdirSync(pathToImageDir);
    let imageBytesTotal = 0;
    imageFileNames.forEach(fileName => {
        imageBytesTotal += getFileSizeInBytes(pathToImageDir + '/' + fileName);
    });
    return imageBytesTotal;
}

function getFileSizeInBytes(path) {
    const stats = fs.statSync(path);
    return stats.size;
}
