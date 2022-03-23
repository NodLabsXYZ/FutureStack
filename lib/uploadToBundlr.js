import { WebBundlr } from "@bundlr-network/client";
// import { ethers } from 'ethers';

const uploadToBundlr = async (file, tags) => {
  let serverSignature;
  const provider = {
    publicKey: {
      toBuffer: () => Buffer.from([0x35, 0x24, 0xa8, 0xda, 0xea, 0xcf, 0xb0, 0x63, 0x56, 0xd9, 0x0d, 0xf7, 0x63, 0x86, 0x23, 0xe9, 0x7d, 0x63, 0x33, 0x7b, 0xa5, 0x84, 0x20, 0x9c, 0x43, 0xbe, 0xb3, 0xd6, 0x62, 0x06, 0x48, 0x15]),
      byteLength: 32
    },
    signMessage: (_message) => {
      return serverSignature;
    }
  }

  // const bundlr = new WebBundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE, "solana", provider, { providerUrl: process.env.NEXT_PUBLIC_BUNDLR_PROVIDER_URL });
  const bundlr = new WebBundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE, "solana", provider);

  console.log("FILE", file)

  const transaction = bundlr.createTransaction(JSON.stringify(file), { tags });
    
  const signature = await transaction.getSignatureData()

  const result = await fetch(
    '/api/uploader/bundlr_signature', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ signature })    
    }
  )

  const { signed } = await result.json();

  const serverSignedArray = []

  for (let i = 0; i < Object.keys(signed).length; i++) {
    serverSignedArray.push(signed[i])
  }

  serverSignature = new Uint8Array(serverSignedArray)

  transaction.getRaw().set(serverSignature, 2)

  const response = await transaction.upload();  
  console.log("RESPONSE", response)
  return response.data.id;
}

export default uploadToBundlr;