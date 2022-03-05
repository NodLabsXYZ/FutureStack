import { supabaseClient } from "..";

const getProjects = async () => {
  const { data, error } = await supabaseClient
    .from('project')
    .select(`
      id,
      title,
      team (
        title
      )
    `)
  return data || [];
}

export default getProjects;