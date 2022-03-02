// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCostToSaveBytesToArweaveInDollars } from 'arweave-nft-uploader'

type Data = {
    cost: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { bytes } = req.query;
    console.log('bytes', bytes)
    const cost = await getCostToSaveBytesToArweaveInDollars(+bytes);
    console.log('cost', cost)
    res.status(200).json({ cost })
}
