import { supabaseClient } from "..";

const createProfile = async (user, data={}) => {
  const { body, error } = await supabaseClient
    .from('profile')
    .insert({
      user_id: user.id,
      email: user.email,
      ...data
    });
      
  console.log("PROFILE", body, error)
  return body[0];
}

export default createProfile;