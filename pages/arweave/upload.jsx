import { ArweaveLayout, FileInstructions, FileUploader } from "../../components/uploader";

const UploadPage = () => {
  return (
    <ArweaveLayout title='File Uploader'>
      <FileInstructions />
      <FileUploader />
    </ArweaveLayout>
  )
}

export default UploadPage;