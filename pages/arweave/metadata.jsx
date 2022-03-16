import { ArweaveHeader, NftUploader, MetadataInstructions } from "../../components/uploader";

const MetadataPage = () => {
  return (
    <div>
      <ArweaveHeader title="Files & Metadata Uploader" />
      <MetadataInstructions />
      <NftUploader />
    </div>
  )
}

export default MetadataPage;