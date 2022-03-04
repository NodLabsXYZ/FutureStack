import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import { connectToLocalArweave, connectToArweave, generateTestKey, ArweaveNftUploader } from 'arweave-nft-uploader'
import Arweave from 'arweave'
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

export default async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    console.log('=============================');
    console.log('=============================');
    console.log('=============================');
    console.log('=============================');
    console.log('=============================');
    console.log('=============================');
    console.log('=============================');
    console.log('=============================');


    let env = process.env.NODE_ENV;
    // env = 'production';
    const { arweaveInstance, key, isMainnet } = await getArweave(env);

    const arweaveNftUploader = new ArweaveNftUploader(arweaveInstance, key, isMainnet);

    // parse form with a Promise wrapper
    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    console.log('data :>> ', data);

    const tempImageFilePath = data.fields.tempImageFilePath;
    const metadata = data.fields.metadata;

    const metadataUri = await arweaveNftUploader.uploadSingleImagePathAndMetadataObject(
        tempImageFilePath,
        JSON.parse(metadata)
    );

    res.status(200).json({ metadataUri })

    // const fileIds = [];
    // for (const file in data.files) {
    //     if (Object.prototype.hasOwnProperty.call(data.files, file)) {
    //         fileIds.push(file);
    //         const element = data.files[file];
    //     }
    // }

    // console.log('fileIds :>> ', fileIds);

    // fileIds.sort();

    // console.log('fileIds :>> ', fileIds);
    // const paths: string[] = [];

    // for (let index = 0; index < fileIds.length; index++) {
    //     const file = data.files[fileIds[index]];
    //     paths.push(file.filepath);
    // }

    // console.log('paths :>> ', paths);

    // const numberOfItemsToUpload = Math.ceil(paths.length / 2);

    // const orderedImagePaths = paths.splice(0, numberOfItemsToUpload);
    // const orderedMetadataPaths = paths;

    // console.log('orderedImagePaths :>> ', orderedImagePaths);
    // console.log('orderedMetadataPaths :>> ', orderedMetadataPaths);

    // const uris: string[] = [];
    // for (let index = 0; index < numberOfItemsToUpload; index++) {
    //     const imagePath = orderedImagePaths[index];
    //     const metadataPath = orderedMetadataPaths[index];

    //     if (!imagePath || !metadataPath) {
    //         res.status(500);
    //     }

    //     console.log('imagePath :>> ', imagePath);
    //     console.log('metadataPath :>> ', metadataPath);

    //     try {
    //         const metadataUri = await arweaveNftUploader.uploadSingleImagePathAndMetadataPath(
    //             imagePath!,
    //             metadataPath!
    //         )
    //         console.log('metadataUri from next server :>> ', metadataUri);

    //         uris.push(metadataUri);
    //     } catch (error) {
    //         console.error(error);
    //     }


    // }

    // res.status(200).json({ uris })
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
        const localArweaveInstance = await connectToLocalArweave(false);
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