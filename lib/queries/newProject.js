import { supabaseClient } from "..";

const newProject = async (data) => {
  const user = await supabaseClient.auth.user();

  let team = await getTeam(user.id);

  if (!team) {
    team = await createTeam('My Team');

    let profile = await getProfile(user.id);

    if (!profile) {
      profile = await createProfile(user.id)
    }

    await createProfileTeam(profile.id, team.id);
  }

  data.team_id = team.id;
  const project = await createProject(data);
    
  return project;
}

const getTeam = async (userId) => {
  const { data, error } = await supabaseClient
    .from('team')
    .select('*, profile!inner(*)')
    .eq('profile.user_id', userId)
    .maybeSingle();

  return data;
}

const createTeam = async (title) => {
  const { body } = await supabaseClient
    .from('team')
    .insert({
      title: title,
    })
  
  return body[0];
}

const getProfile = async (userId) => {
  await supabaseClient
    .from('profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
}

const createProfile = async (userId) => {
  const { body } = await supabaseClient
    .from('profile')
    .insert({
      user_id: userId
    })
  
  return body[0];
}

const createProfileTeam = async (profileId, teamId) => {
  await supabaseClient
    .from('_profileToteam')
    .insert({
      A: profileId,
      B: teamId
    })
}

const createProject = async (data) => {
  const { body } = await supabaseClient
    .from('project')
    .insert(data)

  return body[0];
}

export default newProject;