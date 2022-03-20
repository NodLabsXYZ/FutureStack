import { TWButton } from '..'
import store from 'store2';

const ArweaveSurveyButton = ({ onClick }) => {
  const surveyStore = store.namespace('survey')
  const survey = surveyStore('arweave')
  
  const retake = () => {
    surveyStore('survey', null)
    setSurvey(null)
    onClick()
  }

  if (survey?.results?.claimed) {
    return <></>
  }

  if (survey) {
    return (
      <div className='text-center'>
        <div className='pb-3'>
          Thank you for completing the survey. 
        </div>
        <div>
          {survey.verified && "Your discount has been applied above"}
          {!survey.verified && (
            <>
              <div className='pb-3'>
                Please confirm your email address to apply the discount.
              </div>
              <div className='text-center'>
                <a
                  className='text-blue-600 underline cursor-pointer'
                  onClick={retake}
                >
                  Retake Survey
                </a>
              </div>
            </>
          )}        
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