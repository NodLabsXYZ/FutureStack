import { supabaseClient } from "..";

const createSurvey = async (title, email, result) => {
  const { body, error } = await supabaseClient
    .from('survey')
    .insert({
      title,
      email,
      results: result.data
    })
  
  return body[0];
}

export default createSurvey;