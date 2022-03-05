import { supabaseClient } from "..";

const getContracts = async (openSource=false) => {
  let query = supabaseClient
    .from('contract')
    .select('*')
    
  if (openSource)  { query = query.eq('opensource', true) }
  
  const { data, error } = await query
    
  return data || [];
}

export default getContracts;