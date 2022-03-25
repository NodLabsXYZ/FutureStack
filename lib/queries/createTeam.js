import { supabaseClient } from "..";

const createTeam = async (profile, data={}) => {
  const { body, error } = await supabaseClient
    .from('teams')
    .insert({
      title: 'My Team',
      ...data
    });
   
  if (error) {
    console.log("Error creating team", error);
    return;
  }
  
  _createProfileTeam(profile.id, body[0].id);

  return body[0];
}

const _createProfileTeam = async (profileId, teamId) => {
  await supabaseClient
    .from('_profilesToteams')
    .insert({
      A: profileId,
      B: teamId
    })
}

export default createTeam;