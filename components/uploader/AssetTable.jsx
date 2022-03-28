import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAssets } from '../../lib/queries';

const PER_PAGE = 10;

const AssetTable = ({ project }) => {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const loadAssets = async () => {
      const _assets = await getAssets(project);
      setAssets(_assets);
    }

    loadAssets();   
  }, [project])

  const pageAssets = assets.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  
  const pages = []
  for (let i=0; i<Math.ceil(assets.length / PER_PAGE); i++) {
    pages.push(i + 1);
  }
  
  return (
    <div>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>Image</th>
              <th className='px-6 py-3'>Link</th>
              <th className='px-6 py-3'>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {pageAssets.map((asset, index) => {
              const { arweaveUri, arweaveMetadata, arweaveManifest } = asset.info;
              return (
                <tr key={`asset-${index}`} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
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
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
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
    </div>
  )
}

export default AssetTable;