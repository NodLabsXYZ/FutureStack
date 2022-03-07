import { supabaseClient } from "../../lib";

const AssetDashboard = ({ project }) => {

  const saveAsset = async () => {
    const { body, error } = await supabaseClient.from('asset').insert({
      image_uri:            '',
      metadata:             '',
      onchain_image_uri:    '',
      onchain_metadata_uri: '',
      project_id:         ''
    });

    console.log("ASSET INSERTED", body, error);

    const { data } = await supabaseClient.from('asset').select('*');

    console.log("ASSETS", data);
  }


  return (
    <div>
      <h2 className='text-lg'>Assets: {project.title}</h2>
    </div>
  )
}

export default AssetDashboard;