import { supabaseClient } from "..";

const createContract = async (data) => {
  const { body, error } = await supabaseClient
    .from('contract')
    .insert(data)
  
  return body;
}

export default createContract;