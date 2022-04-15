import { supabaseClient } from "..";

const getSurvey = async ({ id=null, email=null }) => {
  const query = supabaseClient
    .from('surveys')
    .select(`*`)

  if (id) query = query.eq('id', id)
  if (email) query = query.eq('email', email)

  const { data, error } = await query.maybeSingle()
    
  return data;
}

export default getSurvey;