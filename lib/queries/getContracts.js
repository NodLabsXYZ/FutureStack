import { supabaseClient } from "..";

const getContracts = async ({ projectId, opensource=false }) => {
  let query = supabaseClient
    .from('contract')
    .select('*')
    .eq('opensource', opensource);
    
  if (projectId) { query = query.eq('project_id', projectId) }
  
  const { data, error } = await query
    
  return data || [];
}

export default getContracts;