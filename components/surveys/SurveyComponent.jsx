import React from "react"
import * as Survey from "survey-react" // import surveyjs
import "survey-react/modern.min.css"

const SurveyComponent = ({ questions, onComplete }) => {
  Survey.StylesManager.applyTheme("modern")

  const css = {
    matrix: {
        root: "bg-red-600"
    },
    navigationButton: "button btn-lg"
};

  const survey = new Survey.Model(questions)

  survey.onComplete.add(onComplete)

  survey
    .onUpdateQuestionCssClasses
    .add(function (_survey, options) {
        const classes = options.cssClasses

        // classes.root = "sq-root border ";
        classes.title = 'text-sm font-semibold';
        // classes.item = "sq-item";
        // classes.label = "sq-label";

        // if (options.question.isRequired) {
        //     classes.title += " sq-title-required";
        //     classes.root += " sq-root-required";
        // }

        // if (options.question.getType() === "checkbox") {
        //     classes.root += " sq-root-cb";
        // }
    });

  return (
    <div className="container">
      <Survey.Survey model={survey} />
    </div>
  )
}

export default SurveyComponent