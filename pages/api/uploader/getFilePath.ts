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
    filePath: string
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

    const file = data.files.image;

    res.status(200).json({ filePath: file.filepath })
}
