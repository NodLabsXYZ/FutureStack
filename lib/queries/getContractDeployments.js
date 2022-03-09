import { supabaseClient } from "..";

const getContractDeployments = async ({ projectId }) => {
  let query = supabaseClient
    .from('contract_deployment')
    .select('*')
    .eq('project_id', projectId);
    
  const { data, error } = await query
    
  return data || [];
}

export default getContractDeployments;