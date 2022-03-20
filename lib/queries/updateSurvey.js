import { supabaseClient } from "..";

const updateSurvey = async (id, data) => {
  const { body, error } = await supabaseClient
    .from('survey')
    .update(data)
    .eq('id', id)
  
  return body;
}

export default updateSurvey;