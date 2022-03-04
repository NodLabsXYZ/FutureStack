import { supabaseClient } from "..";

const getContracts = async (publicContract=false) => {
  let query = supabaseClient
    .from('contract')
    .select('id, name')
    
  if (publicContract)  { query = query.eq('public', true) }
  
  const { data, error } = await query
    
  return data || [];
}

export default getContracts;