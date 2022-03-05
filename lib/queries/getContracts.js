import { supabaseClient } from "..";

const getContracts = async (openSource=false) => {
  let query = supabaseClient
    .from('contract')
    .select('id, name, info, project_id')
    
  if (openSource)  { query = query.eq('opensource', true) }
  
  const { data, error } = await query
    
  return data || [];
}

export default getContracts;