import ErrorPage from "../components/ErrorPage";

export default function GenericError() {
  return (
    <ErrorPage
      heading="There was an error"
      subheading="The team has been notified and we'll get to it right away. You can also:"
      primaryButtonText="Start over"
      primaryButtonHref="/"
    />
  )
}
