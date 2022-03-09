import { supabaseClient } from "..";

const getContracts = async ({ projectId }) => {
  let query = supabaseClient
    .from('contract_deployments')
    .select('*')
    .eq('project_id', projectId);
    
  const { data, error } = await query
    
  return data || [];
}

export default getContracts;