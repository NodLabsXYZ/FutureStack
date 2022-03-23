import Bundlr from "@bundlr-network/client";

export default async function handle(req, res) {
  const privateKey = process.env.SOL_PRIVATE_KEY;

  // const bundlr = new Bundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE, "solana", privateKey, { providerUrl: process.env.NEXT_PUBLIC_BUNDLR_PROVIDER_URL });
  const bundlr = new Bundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE, "solana", privateKey);

  const { signature } = req.body;

  const signatureArray = []

  for (let i = 0; i < Object.keys(signature).length; i++) {
    signatureArray.push(signature[i])
  }

  const uintSignature = new Uint8Array(signatureArray)

  const signed = await bundlr.currencyConfig.sign(uintSignature);

  res.json({ signed });
}



