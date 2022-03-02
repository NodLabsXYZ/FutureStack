// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCostOfARInDollars } from 'arweave-nft-uploader'

type Data = {
    cost: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const costOfAR = await getCostOfARInDollars();
    res.status(200).json({ cost: costOfAR })
}
