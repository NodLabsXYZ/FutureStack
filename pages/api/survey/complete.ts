// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseClient } from '../../../lib'
import { getSurvey, updateSurvey } from '../../../lib/queries'

type Data = {
    email: String
}

type Survey = {
    id:         String
    title:      String
    email?:     String
    results?:   any
    verified:   Boolean 
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
  const { email } = req.query
  const survey = await getSurvey({ email }) as Survey

  if (survey) {
    if (!survey.verified) {
      survey.verified = true;
      updateSurvey(survey.id, survey)    
    }
  }

  // Need to credit the account by creating a transaction
  // and updating the profile to reflect the current stored_value
  await supabaseClient
    .from('')
  
  // Need to return the survey

  res.status(200).json({ survey })
}
