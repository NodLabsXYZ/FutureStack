import { ProjectWrapper } from "../../../../components";
import { FileUploader } from '../../../../components/uploader'

const AddFilesPage = () => {

  return (
    <ProjectWrapper>
      <h1 className='text-xl'>Add Files</h1>

      <FileUploader />
    </ProjectWrapper>
  )
}

export default AddFilesPage;