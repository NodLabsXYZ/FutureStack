import { supabaseClient } from "..";

const getContract = async (id) => {
  let query = supabaseClient
    .from('contracts')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  
  const { data, error } = await query
    
  return data || [];
}

export default getContract;