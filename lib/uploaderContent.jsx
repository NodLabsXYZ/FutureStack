import { CodeBlock, dracula } from "react-code-blocks";
import Image from 'next/image';
import { JsonDisplay } from '../components';
import { ContractUriDisplay } from '../components/uploader';
import InformationAlertBar from '../components/InfoAlertBar';

const exampleImageBaseURI = 'https://arweave.net/cvToh8C_sM9FYhGcpWqSAOLJqO2Anv6V4QXtT3VOLh4/';
const exampleFileName = '1.jpg';
const exampleImage = exampleImageBaseURI + exampleFileName;
const exampleMetadataBaseURI = 'https://arweave.net/HgSjSaOKq2mTSLvNb_2b224fA-r86z6Ogi0xTOWKaio/';
const exampleMetadataFileNames = "['1', '2', '3', ...]"
const exampleMetadataLink = exampleMetadataBaseURI + '1';

const uploaderContent = {
  "Supported file types": (
    <p>
      All file types, directories, and any quantity of each is supported.
    </p>
  ),
  "Upload results and how to use them": (
    <p>
      When your upload finishes, you&apos;ll get a list of URLs that look like this:
      <br />
      <code>{exampleImage}</code>
      <br />
      Each URL points to your file stored on Arweave. Use it in your application the same way you&apos;d use any other image URL.
      You can also quickly view the file by pasting it into your browser.
    </p>
  ),
  "What an NFT actually is": (
    <p>
      Because it takes so much money to store data on chains like Ethereum, an NFT is mostly
      a URL pointer (called the <code>TokenURI</code>) to information about the NFT, called the <code>metadata</code>.
      This <code>metadata</code> is a JSON file that has different attributes and traits of the NFT, including another
      URL pointing to where the image is stored.
      <br /><br />
      The <code>TokenURI</code> which points to the metadata and <code>ImageURI</code> which points to the image can be URLs that point
      to files stored on Arweave.
    </p>
  ),
  "Arweave can store data for NFTs on any blockchain and works with OpenSea": (
    <p>
      Any public and private blockchain can reference Arweave URLs.
      NFT metadata can be stored and queried by marketplaces like OpenSea with no extra configuration
      as long as it complies with&nbsp;
      <a href="https://docs.opensea.io/docs/metadata-standards" target='_blank' rel="noopener noreferrer" className="text-blue-600 visited:text-purple-600">
          OpenSea&apos;s Metadata Standards
      </a>.
    </p>
  ),
  "How to create and format your images and metadata": (
    <>
        <p>Each NFT should have two files associated with it:</p>
        <ul role="list">
            <li>An image file (<code>.png</code>, <code>.jpeg</code>, <code>.gif</code>, etc.)</li>
            <li>A metadata file (<code>.json</code>) with the traits of the NFT</li>
        </ul>
        <p>
            Before uploading your metadata, make sure it complies with&nbsp;
            <a href="https://docs.opensea.io/docs/metadata-standards" target='_blank' rel="noopener noreferrer" className="text-blue-600 visited:text-purple-600">
                OpenSea&apos;s Metadata Standards
            </a>
            &nbsp;if your NFTs will be on Ethereum or Polygon.
        </p>
        <p>Here&apos;s an example of an image and its associated metadata that could be used when creating an NFT:</p>
        <ExampleImageAndMetadata />
        <InformationAlertBar text={
            (<>The <code>image</code> property of your metadata needs to exist but can just be an empty string. This will get
                overwritten in the upload process.</>)
        }/>
        <p>
            Recommended tools to create your metadata:
            <ul role="list">
                <li>
                    <a href="https://www.niftygenerator.xyz/">Nifty Generator</a> (no code required)
                </li>
                <li>
                    <a href="https://github.com/HashLips/hashlips_art_engine">HashLips Art Engine</a> (coding required)
                </li>
            </ul>
        </p>
        <p>
            Or, play around with some images and metadata that already work:
            <br />
            <a href="">Download example images and metadata</a>
            <br />
            <i>Make sure to unzip the folder before using.</i>
        </p>
    </>
  ),
  "Getting ready to upload": (
    <>
        <p>
            When you upload your NFT assets, you&apos;ll need to upload two separate directories: one for your images and one for your metadata.
        </p>
        <p>
            Your files should have the following structure:
        </p>
        <ExampleFileStructure />
        <p>
            <strong>The files will be read in alphanumeric order.</strong> The first image file will be matched with the
            first metadata file and uploaded together. The best way to do this is to name them by incrementing
            number. However, it is not required to have any specific names for your folders or files
            when you upload them using this tool.
        </p>
        <p>
            When uploading, no need to individually select each file. You can just drop or select the entire directory for images or metadata.
        </p>
    </>
  ),
  "Upload results and how to use them": (
    <>
        <p>
            When the upload finishes, you&apos;ll get two things:
        </p>
        <ul className='m-2'>
            <li>
                A <code>baseURI</code> that looks something like:
                <br />
                <code>{exampleMetadataBaseURI}</code>
            </li>
            <li>
                A list of file names that look like:
                <br />
                <code>{exampleMetadataFileNames}</code>
            </li>
        </ul>
        <p>
            Each file name can be appended to the end of the <code>baseURI</code> to form the <code>TokenURI</code> of each NFT.
            Calling this <code>TokenURI</code> will query Arweave and return the metadata JSON file for that NFT.
        </p>
        <p>
            Try it out:
            <br />
            <a
                href={exampleMetadataLink}
                target='_blank'
                rel="noopener noreferrer"
            >
                {exampleMetadataLink}
            </a>
        </p>
        <p>
            Dealing with <code>TokenURI</code>s shaped like this can lead to gas optimizations in your smart contract.
            Here&apos;s an example of Solidity code to get the <code>TokenURI</code> of an Ethereum NFT:
            <br />
            <span className='not-prose text-sm text'>
                <ContractUriDisplay />
            </span>
        </p>
    </>
  ),
  "Why upload metadata": (
    <>
        <p className=''>
            If you are creating NFTs that you want to display on OpenSea, 
            then it helps to have a metadata file (a file with more information about the artwork)
            associated with each image (the artwork). 
            Both the image and the metadata file can be store on Arweave.
        </p>
        <p className=''>
            
            This tool will upload the image, capture the url, edit the metadata to include that url, 
            and then upload the metadata. Then your NFTs can point to the appropriate metadata 
            and services such as Opensea will properly load the metadata and the image to display.
        </p>
    </>
  )
}

function ExampleImageAndMetadata() {
  const name = "Business Doge";
  const metadata = JSON.stringify({
      "name": name,
      "description": "The doges living immutably on Ethereum and Arweave have come to take over the metaverse!",
      "image": exampleImage,
      "attributes": [
          {
              "trait_type": "Favorite Color",
              "value": "Black"
          },
          {
              "trait_type": "Cuteness Level",
              "value": "Too much"
          },
          {
              "trait_type": "Fur Type",
              "value": "Sharp"
          }
      ]
  },
      null, 2)
  return (
      <>
          <figure>
              <Image
                  className="w-full rounded-lg"
                  src={exampleImage}
                  alt={name}
                  height={200}
                  width={270}
              />
          </figure>
          <figure className='text-sm'>
              <JsonDisplay
                  src={JSON.parse(metadata)}
              />
          </figure>
      </>
  )
}

function ExampleFileStructure() {
  const display =
      `images/
├─ 1.jpeg
├─ 2.jpeg
├─ 3.jpeg
├─ ...
metadata/
├─ 1.json
├─ 2.json
├─ 3.json
├─ ...
`
  return (
      <figure className='text-left not-prose'>
          <CodeBlock
              text={display}
              language={'text'}
              theme={dracula}
              showLineNumbers={false}
          />
          <figcaption><i>Both recommended metadata generators will output this file structure.</i></figcaption>
      </figure>
  )
}

const downloadExample = () => {
  console.log('example downloading...');
}

export default uploaderContent