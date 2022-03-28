import { useEffect, useState } from 'react';
import { AssetTable, UploaderCard } from ".";
import { getAssets } from '../../lib/queries';

const AssetDashboard = ({ project }) => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const loadAssets = async () => {
      const _assets = await getAssets(project);
      setAssets(_assets);
    }

    loadAssets();   
  }, [project])

  const manifests = [];
  const files = [];

  assets.forEach(asset => {
    if (asset.info.arweaveManifest) {
      manifests.push(asset);
    } else {
      files.push(asset);
    }
  });

  return (
    <div>
      <h2 className='text-xl'>Assets: {project.title}</h2>

      {manifests.length > 0 && (
        <div className='py-12'>
          <h3 className='pb-3 text-lg'>Manifest Files</h3>
          <AssetTable assets={manifests} manifest={true} />
        </div>
      )}

      {files.length > 0 && (
        <div className='py-12'>
          <h3 className='pb-3 text-lg'>Files</h3>
          <AssetTable assets={files} />
        </div>
      )}

      <div className='py-12'>
        <h2 className='text-lg font-bold text-center mb-6'>Add More Assets</h2>
        
        <div className='flex justify-around'>
          <UploaderCard
            header='Upload any files'
            subHeader='Upload any files to the arweave blockchain for permanent storage.'
            buttonHref={`/project/${project.id}/asset/add_files`}
            buttonText='Get Started'
          />

          <UploaderCard
            header='Upload assets for NFTs'
            subHeader='Coordinate your images and metadata files for Opensea integration.'
            buttonHref={`/project/${project.id}/asset/add_nfts`}
            buttonText='Get Started'
          />
        </div>
      </div>
    </div>
  )
}

export default AssetDashboard;