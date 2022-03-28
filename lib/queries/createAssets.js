import { supabaseClient } from "..";

const createAssets = async (projectId, data) => {
  
  if (Array.isArray(data)) {
    for (const item of data) {
      item.project_id = projectId
    }
  } else {
    data.project_id = projectId
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