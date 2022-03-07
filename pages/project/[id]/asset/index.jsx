import { supabaseClient } from "../../../../lib";

const AssetPage = () => {
  
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
      <h1>AssetPage</h1>
    </div>
  );
}

export default AssetPage;