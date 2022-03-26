import { supabaseClient } from "..";

const createAssets = async (project, data) => {
  
  if (Array.isArray(data)) {
    for (const item of data) {
      item.project_id = project.id
    }
  } else {
    data.project_id = project.id
  }

  const { body, error } = await supabaseClient
    .from('assets')
    .insert(data, { returning: 'minimal' })
  
  if (error) {
    console.log("Error creating assets:", error)
    return false
  }

  return true;
}

export default createAssets;