import { WebBundlr } from "@bundlr-network/client";
import simpleApiCall from "../simpleApiCall";

const upload = async (data, tags) => {
  let serverSignature;
  const provider = {
    publicKey: {
      toBuffer: () => Buffer.from(process.env.NEXT_PUBLIC_SOL_PUBLIC_KEY, 'hex'),
      byteLength: 32
    },
    signMessage: (_message) => {
      return serverSignature;
    }
  }

  const bundlr = new WebBundlr(
    process.env.NEXT_PUBLIC_BUNDLR_NODE, 
    "solana", 
    provider, 
    { providerUrl: process.env.NEXT_PUBLIC_BUNDLR_PROVIDER_URL }
  );

  const transaction = bundlr.createTransaction(data, { tags });

  const signature = await transaction.getSignatureData()

  const { json } = await simpleApiCall(
    'uploader/bundlr_signature',
    'POST',
    { signature }
  )

  const { signed } = json;

  const serverSignedArray = []

  for (let i = 0; i < Object.keys(signed).length; i++) {
    serverSignedArray.push(signed[i])
  }

  serverSignature = new Uint8Array(serverSignedArray)

  transaction.getRaw().set(serverSignature, 2)

  const response = await transaction.upload();

  return response.data.id;
}

export default upload;