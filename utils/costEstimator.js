import axios from 'axios'

export const getCostToSaveBytesInDollars = async (bytes) => {
    const response = await fetch('/api/uploader/cost/' + bytes);
    const { cost } = await response.json()
    return cost;
}