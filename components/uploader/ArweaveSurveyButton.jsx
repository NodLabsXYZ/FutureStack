import { TWButton } from '..'

const ArweaveSurveyButton = ({ onClick }) => {

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