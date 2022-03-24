import { supabaseClient } from "..";

const createProject = async (team, data={}) => {
  const { body, error } = await supabaseClient
    .from('project')
    .insert({
      team_id: team.id,
      title: "New Project",
      ...data
    })

  return body[0];
}

export default createProject;