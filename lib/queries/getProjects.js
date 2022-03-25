import { supabaseClient } from "..";

const getProjects = async () => {
  const { data, error } = await supabaseClient
    .from('projects')
    .select(`
      id,
      title,
      teams(id, title)
    `)

  if (data) {
    data = data.map(project => ({
      team: project.teams,
      ...project
    }))
  }

  return data || [];
}

export default getProjects;