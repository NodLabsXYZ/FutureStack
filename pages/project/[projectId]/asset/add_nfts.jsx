import { useState } from 'react';
import { ProjectWrapper } from "../../../../components";
import { NftUploader, MetadataInstructions } from '../../../../components/uploader'

const AddNftsPage = () => {
  const [filesSelected, setFilesSelected] = useState(false);

  return (
    <ProjectWrapper>
      <h1>Add NFTs</h1>

      {!filesSelected && <MetadataInstructions />}
      <NftUploader onFilesSelected={() => setFilesSelected(true)} />
    </ProjectWrapper>
  )
}

export default AddNftsPage;