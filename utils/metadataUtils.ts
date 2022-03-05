
export const getNameFromMetadataString = (metadataString: string) => {
    if (!metadataString) {
        return '';
    }
    const metadata = JSON.parse(metadataString);
    return metadata.name;
}