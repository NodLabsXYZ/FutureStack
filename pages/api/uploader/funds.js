import { bundlrClient } from '../../../lib/bundlr'; 

export default async function handle(req, res) {  
  const mbBytes = 1024 * 1024;
  const mbPrice = await bundlrClient.getPrice(mbBytes)
  const balanceBigNumber = await bundlrClient.getLoadedBalance()

  res.json({ 
    funds: balanceBigNumber.toString(),
    mbPrice: mbPrice.toString() 
  });
}

