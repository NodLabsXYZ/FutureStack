import { useState } from 'react';
import Image from 'next/image';

const PER_PAGE = 10;

const AssetTable = ({ assets, manifest }) => {
  const [page, setPage] = useState(0);

  const pageAssets = assets.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  
  const pages = []
  for (let i=0; i<Math.ceil(assets.length / PER_PAGE); i++) {
    pages.push(i + 1);
  }
  
  const readableDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const manifestToData = (manifestUrl) => {
    const parts = manifestUrl.split('/');
    parts.splice(parts.length - 1, 0, 'tx');
    return `${parts.join('/')}/data.json`;
  }

  return (
    <div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              {manifest && (
                <>
                  <th className='px-6 py-3'>Default File</th>
                  <th className='px-6 py-3'>Manifest Data</th>
                </>
              )}
              {!manifest && (
                <>
                  <th className='px-6 py-3'>Image</th>
                  <th className='px-6 py-3'>Link</th>
                  <th className='px-6 py-3'>Metadata</th>
                </>
              )}
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {pageAssets.map((asset, index) => {
              const { arweaveUri, arweaveMetadata, arweaveManifest } = asset.info;
              return (
                <tr key={`asset-${index}`} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                  {manifest && (
                    <>
                      <td className='px-6 py-3'>
                        <a 
                          href={arweaveManifest}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {arweaveManifest}
                        </a>
                      </td>
                      <td className='px-6 py-3'>
                        <a 
                          href={manifestToData(arweaveManifest)}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {manifestToData(arweaveManifest)}
                        </a>
                      </td>
                    </>
                  )}
                  {!manifest && (
                    <>
                      <td className='px-6 py-3'>
                        {arweaveUri ? (
                          <Image 
                            src={arweaveUri}
                            alt={`asset-${index}`}
                            width={60}
                            height={60}
                          />
                        ) : <>&nbsp;</>}
                      </td>
                      <td className='px-6 py-3'>
                        <a 
                          href={arweaveUri}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {arweaveUri}
                        </a>
                      </td>
                      <td className='px-6 py-3'>
                        {arweaveMetadata || arweaveManifest ? (
                          <a 
                            href={arweaveMetadata || arweaveManifest}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            {arweaveMetadata || arweaveManifest}
                          </a>
                        ) : <>&nbsp;</>}
                      </td> 
                    </>
                  )}
                  <td>
                    {readableDate(asset.created_at)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {pages.length > 1 && (
        <div className='flex mt-3'>
          <div>
            Page:
          </div>
          {pages.map((page) => (
            <div 
              key={`page-${page}`}
              className='border px-3 py-1 ml-3 cursor-pointer'
              onClick={() => setPage(page - 1)}
            >
              {page}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AssetTable;