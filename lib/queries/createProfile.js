import { supabaseClient } from "..";

const createProfile = async (user, data={}) => {
  const { body, error } = await supabaseClient
    .from('profiles')
    .insert({
      user_id: user.id,
      email: user.email,
      ...data
    });

  console.log("CREATE PROFILE", body, error);

  if (error) {
    console.log("Error creating profile", error)
  }
      
  return body?.[0];
}

export default createProfile;