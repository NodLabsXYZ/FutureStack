import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
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

// NOTE:
// This is done on the server because React doesn't have access to 'fs'
// So I couldn't find a way for the client to open and read the submitted JSON files.

const getJson = async (
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

    const paths: string[] = [];

    for (let index = 0; index < fileIds.length; index++) {
        const file = data.files[fileIds[index]];
        paths.push(file.filepath);
    }

    const json = JSON.parse(readFileSync(paths[0], 'utf8'));

    res.status(200).json({ json })
}

export default getJson;