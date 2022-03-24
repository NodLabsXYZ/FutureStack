import { supabaseClient } from "..";

const getProfileTeamsProjects = async (userId) => {
  let query = supabaseClient
    .from('profile')
    .select('*, team( project (id) )')
    .eq('user_id', userId)
    .maybeSingle();
      
  const { data, error } = await query;

  return data;
}

export default getProfileTeamsProjects;