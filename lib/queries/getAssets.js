import { supabaseClient } from "..";

const getAssets = async (project) => {
  const { data, error } = await supabaseClient
    .from('assets')
    .select(`*`)
    .eq('project_id', project.id)

  return data || [];
}

export default getAssets;