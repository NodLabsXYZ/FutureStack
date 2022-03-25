import { supabaseClient } from "..";

const getProject = async (id) => {
  const { data, error } = await supabaseClient
    .from('projects')
    .select(`
      id,
      title
    `)
    .eq('id', id)
    .maybeSingle()
    
  return data;
}

export default getProject;