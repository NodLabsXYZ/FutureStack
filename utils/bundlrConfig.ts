import Bundlr from '@bundlr-network/client';
import { serverPath } from './constants';

export const TEMP_NFT_DATA_DIR = 'temp/';
// export const TEMP_NFT_DATA_DIR = serverPath('/public/tempNftData/');
export const BUNDLR_NODE_URL = 'https://node1.bundlr.network/'
// choose 'solana' or 'arweave'
export const CHOSEN_BUNDLR_CURRENCY = 'solana'

// string for Sol private key, object for Arweave (which is a JSON web key AKA JWK)
let key: string | object;
if (CHOSEN_BUNDLR_CURRENCY === 'solana') {
    key = getKeyFromEnv("SOL_PRIVATE_KEY");
} else if (CHOSEN_BUNDLR_CURRENCY === 'arweave') {
    key = JSON.parse(getKeyFromEnv("ARWEAVE_KEY"));
} else {
    throw new Error("chosen bundlr currency is incorrect. Must exactly match 'solana' or 'arweave'");
}

export const PRIVATE_KEY_FOR_BUNDLR = key;

export const BUNDLR = new Bundlr(BUNDLR_NODE_URL, CHOSEN_BUNDLR_CURRENCY, PRIVATE_KEY_FOR_BUNDLR);

function getKeyFromEnv(keyEnvVarName: string): string {
    if (process.env[keyEnvVarName] === '' || !process.env[keyEnvVarName]) {
        throw new Error(`No ${keyEnvVarName}. Set ${keyEnvVarName} environment variable.`);
    }
    return process.env[keyEnvVarName];
}

