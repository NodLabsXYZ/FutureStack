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
    clientTempFilePath: string
}
/*
This is done on the server because the 'formidable' package gives
access to a local file stored on the client's machine. This is hacky
and I don't like it, but it works for now. In the future I'd like to 
figure out a way to get the local file without needing to call the server
(or not need a local client file at all).

One way would be to store a dataURL or base64 encode the files, but if
the user has 100 images to upload that would probably go past the limit
that's allowed to be in local storage, which is 2MB-10MB depending on browser.
*/

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

    const clientTempFilePath = file.filepath;

    res.status(200).json({ clientTempFilePath })
}
