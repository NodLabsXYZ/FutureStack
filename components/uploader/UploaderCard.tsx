import { NextLink } from '../../components';

type UploadCardContent = {
  header: string,
  subHeader: string,
  buttonText: string,
  buttonHref: string
}

function UploadCard(props: UploadCardContent): JSX.Element {
  return (
    <div className="s overflow-hidden shadow rounded-lg divide-y divide-gray-200 bg-white">
      <div className="px-4 py-5 sm:px-6 text-center prose">
        <h2>{props.header}</h2>
      </div>
      <div className="px-4 py-5 sm:p-6 text-center text-slate-900">
        {props.subHeader}
        <br />
        <NextLink href={props.buttonHref}>
          <a
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {props.buttonText}
          </a>
        </NextLink>

      </div>
    </div>
  )
}

export default UploadCard;