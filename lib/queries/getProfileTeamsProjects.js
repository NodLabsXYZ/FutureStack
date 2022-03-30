import { supabaseClient } from "..";

const getProfileTeamsProjects = async () => {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*, _profilesToteams( teams( id, projects (id) ) )')
    // .eq('user_id', userId)
    .maybeSingle();
       
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