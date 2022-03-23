import { PRICE_IN_CENTS_PER_MB, PRICE_MINIMUM_IN_CENTS } from "../constants";

const calculatePurchasePriceInCents = (bytes: number): number => { 
    const mbToUpload = bytes / 1024 / 1024;
    let purchasePrice = PRICE_IN_CENTS_PER_MB * mbToUpload;
    if (purchasePrice < PRICE_MINIMUM_IN_CENTS) {
        purchasePrice = PRICE_MINIMUM_IN_CENTS;
    }
    return purchasePrice;
}

export default calculatePurchasePriceInCents;