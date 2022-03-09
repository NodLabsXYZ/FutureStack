import { supabaseClient } from "..";

const createContractDeployment = async (data) => {
  const { body, error } = await supabaseClient
    .from('contract_deployment')
    .insert(data)
  
  return body;
}

export default createContractDeployment;