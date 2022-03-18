import dynamic from 'next/dynamic'
import { createSurvey } from '../../lib/queries'

const SurveyComponent = dynamic(() => import("./SurveyComponent"), {
  ssr: false,
})

const ArweaveSurvey = () => {
  
  const onComplete = (result) => {
    createSurvey(result)
  }

  return (
    <div className="container">
      <SurveyComponent questions={questions} onComplete={onComplete} />
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