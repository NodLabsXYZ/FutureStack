import React from "react"
import * as Survey from "survey-react" // import surveyjs
import "survey-react/modern.min.css"

const SurveyComponent = ({ questions, onComplete }) => {
  Survey.StylesManager.applyTheme("modern")

  const survey = new Survey.Model(questions)

  survey.onComplete.add(onComplete)

  return (
    <div className="container">
      <Survey.Survey model={survey} />
    </div>
  )
}

export default SurveyComponent