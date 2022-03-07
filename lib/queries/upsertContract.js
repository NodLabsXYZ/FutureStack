import { supabaseClient } from "..";

const upsertContract = async (data) => {
  const { body, error } = await supabaseClient
    .from('contract')
    .upsert(data)
  
  return body;
}

export default upsertContract;