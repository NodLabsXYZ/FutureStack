import { supabaseClient } from "..";

const getProfileTeamsProjects = async (userId) => {
  let query = supabaseClient
    .from('profiles')
    .select('*, _profilesToteams( teams( id, projects (id) ) )')
    .eq('user_id', userId)
    .maybeSingle();
      
  const { data, error } = await query;
  
  if (error) {
    console.error("Error getting profile", error);
    return;
  }

  if (data?._profilesToteams) {
    data.teams = data._profilesToteams.map(({ teams }) => teams);
  }
  
  return data;
}

export default getProfileTeamsProjects;