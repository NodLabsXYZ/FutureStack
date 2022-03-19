import { NftUploader, MetadataInstructions, ArweaveLayout } from "../../components/uploader";
import { useState } from "react";
import { ArweaveSurvey } from "../../components/surveys";

const MetadataPage = () => {
  const [filesSelected, setFilesSelected] = useState(false);

  return (
    <ArweaveLayout title="Files & Metadata Uploader">
      {!filesSelected && <MetadataInstructions />}
      <NftUploader onFilesSelected={() => setFilesSelected(true)} />
    </ArweaveLayout>
  )
}

export default MetadataPage;