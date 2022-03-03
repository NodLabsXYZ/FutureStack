import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import { connectToLocalArweave, connectToArweave, generateTestKey, ArweaveNftUploader } from 'arweave-nft-uploader'
import Arweave from 'arweave'
import { JWKInterface } from 'arweave/node/lib/wallet';
import { readFileSync } from 'fs';


// disable body parser for file reading
export const config = {
    api: {
        bodyParser: false,
    }
};

type Data = {
    json: any
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    // parse form with a Promise wrapper
    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })



    const fileIds = [];
    for (const file in data.files) {
        if (Object.prototype.hasOwnProperty.call(data.files, file)) {
            fileIds.push(file);
            const element = data.files[file];
        }
    }

    console.log('fileIds :>> ', fileIds);


    console.log('fileIds :>> ', fileIds);
    const paths: string[] = [];

    for (let index = 0; index < fileIds.length; index++) {
        const file = data.files[fileIds[index]];
        paths.push(file.filepath);
    }

    console.log('paths :>> ', paths);


    const json = JSON.parse(readFileSync(paths[0], 'utf8'));

    res.status(200).json({ json })


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
