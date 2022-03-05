import { IncomingForm } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    prismaClient
} from '../../../lib/server'
import { NftObject } from '../../../types/NftObject'

// disable body parser for file reading
export const config = {
    api: {
        bodyParser: false,
    }
};

type Data = {
    fields: object,
    files: object
}

type Response = {

}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<Response>
) => {

    // parse form with a Promise wrapper
    const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    const metadata = data.fields.metadata;
    const imageFile = data.files.image;
    const filePath = imageFile.filepath;

    console.log('metadata :>> ', metadata);

    console.log('imageFile :>> ', imageFile);

    console.log('filePath :>> ', filePath);

    // const { data, error } = await supabase
    //     .storage
    //     .from('avatars')
    //     .upload('public/avatar1.png', avatarFile, {
    //         cacheControl: '3600',
    //         upsert: false
    //     })

    // const project = await prismaClient.nftStorageData.create({
    //     data: {
    //         centrallyStoredImageUri: imageFile.filepath
    //     }
    // })
    // res.json(project);
}