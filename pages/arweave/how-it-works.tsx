import NextLink from '../../components/NextLink';
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { uploaderContent } from '../../lib'

type AccordionProps = {
    sectionList: string[]
}

const uploadingFilesContent: string[] = [
    "Supported file types",
    "Upload results and how to use them",
]

const uploadingNFTsContent: string[] = [
    "What an NFT actually is",
    "Arweave can store data for NFTs on any blockchain and works with OpenSea",
    "How to create and format your images and metadata", 
    "Getting ready to upload",
    "Upload results and how to use them"
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function Accordion(props: AccordionProps) {
    const sectionList = props.sectionList;
    return (
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                {sectionList.map((section) => (
                    <Disclosure as="div" key={section} className="pt-6">
                        {({ open }) => (
                            <>
                                <dt className="text-lg">
                                    <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                        <span className="font-medium text-gray-900">{section}</span>
                                        <span className="ml-6 h-7 flex items-center">
                                            <ChevronDownIcon
                                                className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Disclosure.Button>
                                </dt>
                                <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                    {uploaderContent[section]}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </dl>
        </div>
    )
}

const HowItWorks = () => {
    return (
        <div className="relative pb-12 bg-white overflow-hidden">
            <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
                <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
                    <svg
                        className="absolute top-12 left-full transform translate-x-32"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384"
                    >
                        <defs>
                            <pattern
                                id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
                    </svg>
                    <svg
                        className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384"
                    >
                        <defs>
                            <pattern
                                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
                    </svg>
                    <svg
                        className="absolute bottom-12 left-full transform translate-x-32"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384"
                    >
                        <defs>
                            <pattern
                                id="d3eb07ae-5182-43e6-857d-35c643af9034"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width={404} height={384} fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
                    </svg>
                </div>
            </div>
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="text-lg max-w-prose mx-auto">
                    <h1>
                        <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                            Uploading to Arweave
                        </span>
                        <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            How it Works
                        </span>
                    </h1>
                </div>
                <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
                    <p>
                        <a href="https://www.arweave.org/" target='_blank' rel="noreferrer">Arweave</a> is
                        a decentralized storage network that seeks to offer a platform for the <strong>indefinite storage</strong> of data.
                    </p>
                    <p>
                        Arweave&apos;s major benefits:
                    </p>
                    <ul role="list">
                        <li>Upfront payment that guarantees the permanent storage of any type of file</li>
                        <li>Files are accessible through traditional web browsers and blockchains</li>
                        <li>Files are free to view - no special wallet or service is needed</li>
                    </ul>
                    <p>
                        However, there can be a steep learning curve for interacting with Arweave and it is usually done just once per project.
                        That&apos;s why using a tool like this makes it easy to reliably &quot;set it and forget it&quot; with your decentralized file storage.
                    </p>
                    <h2>Uploading files (for non-NFT use cases)</h2>
                    <Accordion sectionList={uploadingFilesContent} />
                    <h2>Uploading NFT assets</h2>
                    <Accordion sectionList={uploadingNFTsContent} />
                    <h2>Ready to begin?</h2>
                    <p>
                        <NextLink href="/arweave">Upload now</NextLink>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks;