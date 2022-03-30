import { bundlrClient, fundAccount } from '../../../lib/bundlr'; 

export default async function handle(req, res) {  
  const { byteCount } = req.body;

  await fundAccount(bundlrClient, byteCount);

  res.json({ ok: true });
}