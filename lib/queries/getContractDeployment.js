import { supabaseClient } from "..";

const getContractDeployment = async (id) => {
  let query = supabaseClient
    .from('contract_deployments')
    .select('*, contracts(*), projects(id, title)')
    .eq('id', id)
    .maybeSingle()
  
  const { data, error } = await query

  if (error) {
    console.error("Error getting contract deployment", error);
    return;
  }

  if (data) {
    data.project = data.projects
    data.contract = data.contracts
  }
    
  return data || [];
}

export default getContractDeployment;