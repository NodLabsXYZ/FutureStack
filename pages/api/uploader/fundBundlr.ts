// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCostOfARInDollars } from 'arweave-nft-uploader'
import { BUNDLR } from '../../../utils/bundlrConfig';

type Data = {
    success: boolean
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const address = BUNDLR.address;
    console.log('address :>> ', address);
    
    const balance = await BUNDLR.getLoadedBalance().then(bn => bn.toNumber());
    console.log('loadedBalance :>> ', balance);

    const fundAmount = 50000
    console.log('funding: ', fundAmount);
    
    await BUNDLR.fund(fundAmount);
    console.log('💲 Funding Complete 💲');
    console.log('fundAmount :>> ', fundAmount);
    console.log('=====================');

    res.status(200).json({ success: true })
}
