import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import { connectToLocalArweave, connectToArweave, generateTestKey, ArweaveNftUploader } from 'arweave-nft-uploader'
import Arweave from 'arweave';
import ArLocal from 'ArLocal';
import { JWKInterface } from 'arweave/node/lib/wallet';


// disable body parser for file reading
export const config = {
    api: {
        bodyParser: false,
    }
};

type Data = {
    metadataUri: string
}

type ArweaveConnection = {
    arweaveInstance: Arweave,
    key: JWKInterface,
    isMainnet: boolean
}

let arweaveNftUploader: ArweaveNftUploader;

export default async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    console.log('!arweaveNftUploader :>> ', !arweaveNftUploader);
    if (!arweaveNftUploader) {
        let env = process.env.NODE_ENV;
        // env = 'production';
        arweaveNftUploader = await getArweaveNftUploader(env);
    }

    // parse form with a Promise wrapper
    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    const tempImageFilePath = data.fields.tempImageFilePath;
    const metadata = data.fields.metadata;

    const metadataUri = await arweaveNftUploader.uploadSingleImagePathAndMetadataObject(
        tempImageFilePath,
        JSON.parse(metadata)
    );

    console.log('metadataUri returning from /api/uplodSingle :>> ', metadataUri);

    res.status(200).json({ metadataUri })
}

const getArweaveNftUploader = async (env: string): Promise<ArweaveNftUploader> => {
    const { arweaveInstance, key, isMainnet } = await getArweave(env);
    return new ArweaveNftUploader(arweaveInstance, key, isMainnet);
}

const getArweave = async (env: string): Promise<ArweaveConnection> => {
    console.log('env :>> ', env);
    if (env === 'production') {
        const arweaveInstance = connectToArweave();

        if (!process.env.ARWEAVE_KEY) {
            throw new Error("Error: no Arweave key");
        }

        const key = JSON.parse(process.env.ARWEAVE_KEY);

        const isMainnet = true;

        return {
            arweaveInstance,
            key,
            isMainnet
        }
    } else {
        let localArweaveInstance: Arweave;
        try {
            const { arweave } = await connectToLocalArweave(true, false);
            localArweaveInstance = arweave;
        } catch (error) {
            console.error(error);
            const { arweave } = await connectToLocalArweave(false, false);
            localArweaveInstance = arweave;
        }
        console.log('generating test key');
        const testKey = await generateTestKey(localArweaveInstance);
        const isMainnet = false;

        return {
            arweaveInstance: localArweaveInstance,
            key: testKey,
            isMainnet
        }

    }
}