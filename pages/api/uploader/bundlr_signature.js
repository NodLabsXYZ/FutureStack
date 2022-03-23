import Bundlr from "@bundlr-network/client";

import { fundAccount } from '../../../lib/bundlr'; 

export default async function handle(req, res) {
  const privateKey = process.env.SOL_PRIVATE_KEY;

  const bundlr = new Bundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE, "solana", privateKey, { providerUrl: process.env.NEXT_PUBLIC_BUNDLR_PROVIDER_URL });
  // const bundlr = new Bundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE, "solana", privateKey);

  // console.log(bundlr.currencyConfig.getPublicKey().toString('hex'))

  const { signature, byteCount } = req.body;

  await fundAccount(bundlr, byteCount);

  const signatureArray = []

  for (let i = 0; i < Object.keys(signature).length; i++) {
    signatureArray.push(signature[i])
  }

  const uintSignature = new Uint8Array(signatureArray)

  const signed = await bundlr.currencyConfig.sign(uintSignature);

  res.json({ signed });
}



