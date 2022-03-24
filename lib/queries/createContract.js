import { supabaseClient } from "..";

const createContract = async (data) => {
  const { body, error } = await supabaseClient
    .from('contracts')
    .insert(data)
  
  return body;
}

export default createContract;