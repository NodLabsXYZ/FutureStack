import { supabaseClient } from "..";

const createProject = async (data) => {
  const user = await supabaseClient.auth.user();

  let team = await _getTeam(user.id);

  if (!team) {
    team = await _createTeam('My Team');

    let profile = await _getProfile(user.id);

    if (!profile) {
      profile = await _createProfile(user.id)
    }

    await _createProfileTeam(profile.id, team.id);
  }

  data.team_id = team.id;
  const project = await _createProject(data);
    
  return project;
}

const _getTeam = async (userId) => {
  const { data, error } = await supabaseClient
    .from('team')
    .select('*, profile!inner(*)')
    .eq('profile.user_id', userId)
    .maybeSingle();

  return data;
}

const _createTeam = async (title) => {
  const { body } = await supabaseClient
    .from('team')
    .insert({
      title: title,
    })
  
  return body[0];
}

const _getProfile = async (userId) => {
  await supabaseClient
    .from('profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
}

const _createProfile = async (userId) => {
  const { body } = await supabaseClient
    .from('profile')
    .insert({
      user_id: userId
    })
  
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

const _createProject = async (data) => {
  const { body } = await supabaseClient
    .from('project')
    .insert(data)

  return body[0];
}

export default createProject;