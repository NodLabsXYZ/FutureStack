import { supabaseClient } from "..";

const getSurvey = async (id, email) => {
  const query = supabaseClient
    .from('survey')
    .select(`*`)

  if (id) query = query.eq('id', id)
  if (email) query = query.eq('email', email)
  
  const { data, error } = query.maybeSingle()
    
  return data;
}

export default getSurvey;