import { bundlrClient } from '../../../lib/bundlr'; 

export default async function handle(req, res) {
  const { signature } = req.body;

  const signatureArray = []

  for (let i = 0; i < Object.keys(signature).length; i++) {
    signatureArray.push(signature[i])
  }

  const uintSignature = new Uint8Array(signatureArray)

  const signed = await bundlrClient.currencyConfig.sign(uintSignature);

  res.json({ signed });
}