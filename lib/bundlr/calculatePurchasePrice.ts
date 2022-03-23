
const calculatePurchasePriceInCents = (bytes: number): number => {
    console.log('bytes :>> ', bytes);
    const priceInCentsPerMb = 2; // $2 per 100 MB
    const mbToUpload = bytes / 1024 / 1024;
    console.log('mbToUpload :>> ', mbToUpload);
    const purchasePrice = priceInCentsPerMb * mbToUpload;
    console.log('purchasePrice :>> ', purchasePrice);
    return purchasePrice;
}

export default calculatePurchasePriceInCents;