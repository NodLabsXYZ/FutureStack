import { supabaseClient } from "..";

const createProject = async (team, data={}) => {
  const { body, error } = await supabaseClient
    .from('projects')
    .insert({
      team_id: team.id,
      title: "New Project",
      ...data
    })

  if (error) {
    console.log("Error creating project", error);
    return;
  }

  return body[0];
}

export default createProject;