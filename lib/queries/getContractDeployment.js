import { supabaseClient } from "..";

const getContractDeployment = async (id) => {
  let query = supabaseClient
    .from('contract_deployments')
    .select('*, contracts(*), projects(id, title)')
    .eq('id', id)
    .maybeSingle()
  
  const { data, error } = await query
    
  return data || [];
}

export default getContractDeployment;