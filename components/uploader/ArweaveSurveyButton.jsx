import { useEffect, useState } from 'react';
import { TWButton } from '..'
import store from 'store2';
import { supabaseClient } from '../../lib';
import { getSurvey } from '../../lib/queries'

const ArweaveSurveyButton = ({ onClick }) => {
  const surveyStore = store.namespace('arweaveSurvey')
  // surveyStore('id', null)
  const surveyId = surveyStore('id')

  const [user, setUser] = useState(supabaseClient.auth.user())
  const [survey, setSurvey] = useState()
  
  useEffect(() => {
    if (!surveyId && !user) return;

    const loadSurvey = async () => {
      const _survey = await getSurvey(surveyId, user?.email)

      if (_survey) {
        surveyStore('id', _survey.id)
        setSurvey(_survey)
      }
    }

    loadSurvey()
  }, [user, surveyStore, surveyId])

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (session === null) {
          setUser(null);
        }
      }
    );
  }, [])
  
  if (survey?.results?.claimed) {
    return <></>
  }

  if (surveyId) {
    const verified = survey && user && survey?.email === user.email
    
    return (
      <div className='text-center'>
        <div className='pb-3'>
          Thank you for completing the survey. 
        </div>
        <div>
          {verified ? 
            "Your discount has been applied above" :
            "Please confirm your email address to apply the discount."            
          }          
        </div>
      </div>
    )
  }

  return (
    <div className='py-1 text-center'>
      Fill out a survey to get your first upload for free! 
      <span className='ml-1 text-xs font-slate-600'>
        (up to 500MB)
      </span>
      <TWButton
        classMap={{ margin: 'mt-3' }}
        onClick={onClick}
      >
        Start Survey
      </TWButton>
    </div>
  )
}

export default ArweaveSurveyButton;