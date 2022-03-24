import { supabaseClient } from "..";

const getProfileTeamsProjects = async (userId) => {
  let query = supabaseClient
    .from('profile')
    .select('*, _profileToteam( team( project (id) ) )')
    .eq('user_id', userId)
    .maybeSingle();
      
  const { data, error } = await query;
  
  data.teams = data._profileToteam.map(({ team }) => team);

  return data;
}

export default getProfileTeamsProjects;