import { supabaseClient } from "..";

const createAssets = async (data) => {
  const { body, error } = await supabaseClient
    .from('assets')
    .insert(data)
  
  return body;
}

export default createAssets;