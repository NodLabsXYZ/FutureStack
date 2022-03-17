import { ArweaveHeader, NftUploader, MetadataInstructions } from "../../components/uploader";
import { useState } from "react";

const MetadataPage = () => {
  const [filesSelected, setFilesSelected] = useState(false);

  return (
    <div>
      <ArweaveHeader title="Files & Metadata Uploader" />
      {!filesSelected && <MetadataInstructions />}
      <NftUploader onFilesSelected={() => setFilesSelected(true)} />
    </div>
  )
}

export default MetadataPage;