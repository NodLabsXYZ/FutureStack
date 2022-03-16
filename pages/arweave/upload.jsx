import { ArweaveHeader, FileInstructions, FileUploader } from "../../components/uploader";

const UploadPage = () => {
  return (
    <div>
      <ArweaveHeader title="File Uploader"/>
      <FileInstructions />
      <FileUploader />
    </div>
  )
}

export default UploadPage;