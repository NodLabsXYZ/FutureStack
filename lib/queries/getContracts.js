import { supabaseClient } from "..";

const getContracts = async (projectId, openSource=false) => {
  let query = supabaseClient
    .from('contract')
    .select('*')
    .eq('project_id', projectId)
    
  if (openSource)  { query = query.eq('opensource', true) }
  
  const { data, error } = await query
    
  return data || [];
}

export default getContracts;