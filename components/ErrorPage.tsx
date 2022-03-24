type ErrorPageProps = {
  heading: string,
  subheading: string,
  primaryButtonText: string,
  primaryButtonCallbackFn: any
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <>
      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <div className="sm:ml-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:font-bold sm:text-l">{props.heading}</h1>
            <p className="mt-1 text-base text-gray-500">{props.subheading}</p>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={props.primaryButtonCallbackFn}
              >
                {props.primaryButtonText}
              </button>
              <a
                href="mailto:support@futurestack.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Email support
              </a>
              <a
                href="https://discord.gg/A4ETdGsvjD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Post in Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
