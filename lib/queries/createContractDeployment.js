import { supabaseClient } from "..";

const createContractDeployment = async (data) => {
  const { body, error } = await supabaseClient
    .from('contract_deployments')
    .insert(data)
  
  return body[0];
}

export default createContractDeployment;