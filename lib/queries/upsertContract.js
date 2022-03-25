import { supabaseClient } from "..";

const upsertContract = async (data) => {
  const { body, error } = await supabaseClient
    .from('contracts')
    .upsert(data)
  
  return body;
}

export default upsertContract;