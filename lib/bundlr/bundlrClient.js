import Bundlr from "@bundlr-network/client";

const privateKey = process.env.SOL_PRIVATE_KEY;

const bundlrClient = new Bundlr(
  process.env.NEXT_PUBLIC_BUNDLR_NODE, 
  "solana", 
  privateKey, 
  { providerUrl: process.env.NEXT_PUBLIC_BUNDLR_PROVIDER_URL }
);

console.log("Bundlr client with public key:", bundlrClient.currencyConfig.getPublicKey().toString('hex'))

export default bundlrClient;