import { bundlrClient, fundAccount } from '../../../lib/bundlr'; 

export default async function handle(req, res) {  
  const { byteCount } = req.body;

  await fundAccount(bundlrClient, byteCount);
  const balanceBigNumber = await bundlrClient.getLoadedBalance()

  res.json({ funds: balanceBigNumber.toString() });
}