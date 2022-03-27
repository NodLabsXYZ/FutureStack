import { AssetTable, UploaderCard } from ".";

const AssetDashboard = ({ project }) => {

  return (
    <div>
      <h2 className='text-lg'>Assets: {project.title}</h2>

      <div className='py-6'>
        <AssetTable project={project} />
      </div>

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