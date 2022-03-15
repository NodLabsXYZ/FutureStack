import ErrorPage from "../../components/ErrorPage";

export default function UploadError() {
  return (
    <ErrorPage
      heading="Your upload failed"
      subheading="You may retry - it won't cost you anything extra. Or, you can reach out to support."
      primaryButtonText="Retry upload"
      primaryButtonHref="/uploader/uploading"
    />
  )
}
