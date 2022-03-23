const fundAccount = async (bundlr, byteCount) => {
  const estimatedPriceBN = await bundlr.getPrice(byteCount);
  const estimatedPrice = estimatedPriceBN.toNumber();
  console.log('estimatedPrice :>> ', estimatedPrice);
  const balance = await bundlr.getLoadedBalance().then(bn => bn.toNumber());
  console.log('loadedBalance :>> ', balance);

  if (estimatedPrice >= balance) {
    console.log('=====================');
    console.log('Loaded balance not enough. Funding...');
    const fundAmount = Math.ceil((estimatedPrice - balance) * 1.1); // A little extra just in case. Also must be an int
    await bundlr.fund(fundAmount);
    console.log('💲 Funding Complete 💲');
    console.log('fundAmount :>> ', fundAmount);
    console.log('=====================');
  }
}

export default fundAccount;