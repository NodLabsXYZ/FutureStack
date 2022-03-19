import dynamic from 'next/dynamic'
import { createSurvey } from '../../lib/queries'
import TWButton from '../TWButton'

const SurveyComponent = dynamic(() => import("./SurveyComponent"), {
  ssr: false,
})

const ArweaveSurvey = ({ onCancel }) => {
  
  const onComplete = (result) => {
    createSurvey(
      'arweave', 
      result.data['What is your email? (you will have to verify to continue)'], 
      result
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