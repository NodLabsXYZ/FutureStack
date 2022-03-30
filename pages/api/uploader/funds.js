import { bundlrClient } from '../../../lib/bundlr'; 

export default async function handle(req, res) {  
  const balanceBigNumber = await bundlrClient.getLoadedBalance()

  res.json({ funds: balanceBigNumber.toString() });
}

