import dynamic from 'next/dynamic'
import { useState } from 'react'
import store from 'store2'
import { createSurvey } from '../../lib/queries'
import TWButton from '../TWButton'

const SurveyComponent = dynamic(() => import("./SurveyComponent"), {
  ssr: false,
})

const ArweaveSurvey = ({ onCancel }) => {
  const [complete, setComplete] = useState(false)
  const surveyStore = store.namespace('arweaveSurvey')
  
  const onComplete = async (result) => {
    const survey = await createSurvey(
      'arweave', 
      result.data['What is your email? (you will have to verify to continue)'], 
      result
    )
    
    console.log(survey)
    surveyStore('id', survey.id)
    setComplete(true);
  }

  if (complete) {
    return (
      <div className="text-center text-lg text-slate-600">
        <div className='pt-3'>
          Thank you for completing the survey!
        </div>
        <div className='pt-3'>
          An email has been sent to you. 
          Please click the link in the email to receive your discount.
        </div>
        <div className='pt-6'>
          <TWButton onClick={onCancel}>
            Continue
          </TWButton>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <SurveyComponent questions={questions} onComplete={onComplete} />
      <div className='-mt-12 ml-12'>
        <TWButton
          classMap={{ background: 'bg-red-400', font: 'text-sm', padding: 'px-6 py-1' }}
          onClick={() => onCancel()}
        >
          Cancel
        </TWButton>
      </div>
    </div>
  )
}

export default ArweaveSurvey;


const questions = {
  "logoPosition": "right",
  "pages": [
   {
    "elements": [
      {
        "type": "text",
        "name": "What is your email? (you will have to verify to continue)",
        "title": "What is your email? (you will have to verify to continue)",
        "isRequired": true
    },
     {
      "type": "text",
      "name": "What blockchain are you building on?",
      "title": "What blockchain are you building on?",
      "isRequired": true
     }
    ]
   }
  ]
 }