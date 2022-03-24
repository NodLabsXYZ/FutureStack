import { supabaseClient } from "..";

const createTeam = async (profile, data={}) => {
  const { body, error } = await supabaseClient
    .from('team')
    .insert({
      title: 'My Team',
      ...data
    });
   
  _createProfileTeam(profile.id, body[0].id);

  return body[0];
}

const _createProfileTeam = async (profileId, teamId) => {
  await supabaseClient
    .from('_profileToteam')
    .insert({
      A: profileId,
      B: teamId
    })
}

export default createTeam;